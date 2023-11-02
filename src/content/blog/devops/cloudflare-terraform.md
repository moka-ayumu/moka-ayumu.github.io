---
title: '클라우드플레어 환경을 테라폼으로 구축한 이유'
short: '클라우드플레어 웹 대시보드에는 일부 기능만 있다'
---

만약 클라우드플레어를 사용한다면 저는 테라폼을 사용하는 것을 적극 추천합니다.

## 클라우드플레어 웹 대시보드에는 일부 기능만 있다

클라우드플레어에는 aws 대시보드와 같은 페이지가 있고 대부분의 상황에서는 문제가 없습니다. 그러나, 재미있게도 클라우드플레어 API에는 존재하는 파라미터들이 대시보드에는 없는 경우가 있습니다. 이런 경우에는 직접 API를 호출해야 합니다.

예를 들자면, 클라우드플레어 페이지 프로젝트를 github actions와 같은 CI/CD로 빌드 후 업로드하기 위해 Direct Upload로 만들고 Production 브랜치를 `develop`으로 하고자 한다면 놀랍게도 웹에 그런 설정을 하는 공간이 없습니다. 하지만 wrangler CLI로 아래 명령어를 사용한다면 만들 때 같이 설정이 가능합니다.

```shell
wrangler pages project create direct-upload-project --production-branch develop
```

하지만 이 명령어도 생성시에만 설정이 가능하고 수정이 안되기 때문에 반쪽자리 해결법입니다.  이후에 수정할려면 이제 REST API를 호출해야 합니다.

## REST API가 아닌 테라폼을 통한 관리로 클라우드플레어 99% 활용

```hcl
resource "cloudflare_pages_project" "project" {
  account_id        = "..."
  name              = "direct-upload-project"
  production_branch = "develop"
}
```

위의 코드는 이전의 명령어를 테라폼에 표현한 것입니다. 이를 통해 깔끔하고 상태 추적이 되기 때문에 생성, 수정이 간편하고 다른 사람들이 환경에 대한 설정을 쉽게 파악할 수 있습니다. 물론 Import도 지원하기때문에 기존 리소스와 연결 가능합니다.

해당 리소스에 대한 문서는 [Terraform cloudflare_pages_project](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/pages_project)에서 볼 수 있습니다. 해당 문서에 있는 deployment_configs 등을 보면 웹에서 보지 못하는 수많은 설정들을 확인할 수 있습니다.

## 하지만 어딘가 부족한 1%

실제 프로젝트를 클라우드플레어에 배포하게 될 때, 이를 테라폼으로 구성해보면서 느꼈던 점이 기존 장점과 반대로 '여기에 없는데 웹에는 있는 기능이 있다' 였습니다. 이런 점이 비단 웹이 아니라 데이터 소스를 가져올 때에도 DNS 레코드와 같은 것들은 불가능하여 직접 variable에 변수로 넣어줘야했습니다.

또한, 테라폼을 사용하기 위해서 클라우드플레어 API 키가 필요합니다. 그리고, 해당 API 키에 대하여 권한을 설정하는 부분이 명확하지 않습니다. 일단 각 권한의 대분류가 'Account', 'Zone', 'User' 이렇게  되어있는데 각 API가 요구하는 권한이 저 3곳에 다 퍼져있고 분류가 명확하지 않습니다. 심지어 유사한 같은 이름의 권한이 여러 대분류에 있고 API 파라미터마다 다른 권한을 보는 것(ex. Access: Apps and Policies)도 있습니다.

이러한 점 때문에 좀 매끄럽지 못한 부분들이 느껴졌습니다. 하지만, 현재 서비스 중인 Access와 같은 기능들이 다른 서비스들과 비교해서 간편하고 효율적으로 사용이 가능하기 때문에 사용해 볼 가치는 충분하다고 생각됩니다.


