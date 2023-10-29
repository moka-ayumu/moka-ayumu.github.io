---
title: '엘릭서에서 웹소켓 다루기'
short: 'Plug와 Cowboy를 사용한 웹소켓 통신'
---

## Plug를 이용한 웹소켓 서버 열기

[MOKA STATION:backend](https://github.com/moka-station/backend) 프로젝트를 하면서 실시간 채팅을 구현하기 위하여 Elixir에서 웹소켓 서버를 구현하였다.

## 왜 Elixir인가?

Elixir는 고가용성으로 유명한 Erlang을 사용하는 언어로 특수한 프로세스를 사용한다.
이 프로세스들은 다른 언어와 다른게 매우 가벼워서 매우 많은 프로세스를 생성, 관리가 가능하다.
따라서, 각 연결들은 하나의 프로세스를 생성하고 서로 통신이 가능하기 때문에 다른 언어에 비해 적은 확장으로 많은 처리가 가능하고 특히 프로세스끼리 통신하는 부분(채팅)을 구현하기도 쉽다.

기본적으로 이를 관리할 때는 Registry를 사용한다.
하지만 Registry는 한 서버안의 프로세스들만 공유되므로 클라우드의 수평적 확장성을 사용하려면
여러 서버들의 Registry를 한 곳에 통합해 관리할 추가적인 시스템이 필요하다.

## Registry란?

앞에서 말했듯이 Elixir는 프로세스 관리에 주로 [Registry](https://hexdocs.pm/elixir/1.13.4/Registry.html)를 사용한다.
Registry는 키-값 저장소로, 동일한 키를 여러가 가질 수 있는 :duplicate와 그렇지않은 :unique가 있다.
추후에 키를 사용하여 프로세스 PID를 가져와 메시지를 보내게 된다.

```elixir
children = [
    Registry.child_spec(keys: :duplicate, name: Registry.Test)
]
Supervisor.start_link(children, [strategy: :one_for_one, name: Backend.Application])

Registry.Test
|> Registry.register(key, %{value: "temp"}) # 저장소에 프로세스 저장(PID는 자동으로 함께 저장된다.)

Registry.Test # 특정 키에 해당하는 프로세스 호출
|> Registry.dispatch(key, fn entries ->
    for {pid, value} <- entriers do
        # pid: 해당 키에 맞는 pid
        # value: 해당 키의 값
        Process.send(pid, value, []) # 해당 프로세스에 값 보내기
    end
end)
```

Supervisor를 통하여 저장소를 실행, 할당, 호출하는 방법이다.
keys에 원하는 키 설정과 name에 추후에 사용할 이름을 입력하면 된다.

## 웹소켓 핸들러 구성

웹소켓 핸들러를 구성할 때, 사용하는 cowboy_websocket에 대한 문서는 https://ninenines.eu/docs/en/cowboy/2.6/manual/cowboy_websocket/ 에 있다.
해당 문서를 참고하여 구성하면 되는데 간략하게 설명하겠다.
이 모듈에서 사용되는 state는 자유롭게 설정하는 해당 프로세스의 상태(ex. 유저ID, 이름)이다.
각 프로세스를 통신할 때는 Process.send로 보내고, 이때 같이 보내진 값은 websocket_info 함수에서 Info로서 들어오게 된다.

```elixir

defmodule Backend.SocketHandler do
  @behaviour :cowboy_websocket

  def init(req, \_state) do # 들어온 HTTP 리퀘스트(req)를 필요한 단계를 거쳐 state로 변환후 반환 # ex. 채널명
    {:cowboy_websocket, req, state}
  end

  def websocket_init(state) do # 웹소켓 연결시 초기화 함수 (선택사항)
    {:ok, state} # doc에 있는 CallResult 형식에 따름
  end

  def websocket_handle({:text, message}, state) do # Client가 웹소켓으로 메시지를 보냈을 때 호출되는 함수 # message: 전달된 텍스트 값, state: 현재 프로세스 state # 만약 전달된 값이 json 형식이라면 Jason 라이브러리와 같은 json 처리기를 사용
    {:reply, {:text, value}, state} # CallResult
  end

  def websocket_info(info, state) do # 해당 프로세스로 Elixir내에서 Process.send 함수를 통해 메시지를 보냈을 때 호출되는 함수 # info: 전달된 값, state: 현재 프로세스 state
    {:reply, {:text, value}, state} # CallResult
  end
end

```

## 라우터 구성

먼저, 웹소켓 통신을 하기 위해서는 먼저 HTTP 101 Switching Protocols(https://developer.mozilla.org/ko/docs/Web/HTTP/Status/101) 로 핸드쉐이크를 해야한다.

```elixir
defmodule Backend.Router do
use Plug.Router

    plug(:match)
    plug(:dispatch)

    get "/" do
        # 핸드쉐이크
        {Plug.Cowboy.Conn, req} # conn.adapter # 1. Plug의 conn으로부터 HTML 요청을 읽는다.
        {:cowboy_websocket, _, state} # Backend.SocketHandler.init(req, {}) # 2. cowboy_websocket으로 구성된 모듈의 init 함수를 통하여 state을 계산한다.
        Plug.Conn.upgrade_adapter(conn, :websocket, {Backend.SocketHandler, state, %{}}) # 3. Plug.Conn.upgrade_adater를 통하여 프로토콜을 업그레이드 한다.
    end
end
```

이 과정이 성공적으로 이루어지면, 해당 연결은 앞서 구성한 cowboy_websocket으로 구성된 모듈에서 관리된다.
