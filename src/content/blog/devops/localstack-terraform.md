---
title: 'LocalStack과 Terraform을 활용한 로컬 환경에서 AWS 테스트'
short: ''
---

## LocalStack을 도커환경에서 실행

LocalStack을 실행하는 방법에는 크게 CLI와 도커 2가지로 나뉘어 지는데 개인적으로 로컬 환경에는 영향을 받지 않는 도커를 선호합니다.

아래의 명령어를 사용하여 LocalStack에서 사용되는 포트를 열며 실행합니다.

```shell
docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
```

성공적으로 실행되었다면 대시보드([LocalStack](https://app.localstack.cloud/dashboard))를 접속하여 로그인하면 좌측 메뉴 'LocalStack Instances'에 뜹니다. 이를 통해 모든 서비스는 아니지만 대부분의 서비스를 시각적으로 다룰 수 있습니다.

## Terraform 설치

[Install | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/downloads?product_intent=terraform) 해당 사이트에서 각 OS에 맞게 CLI를 설치한다. 윈도우는 파일을 받고 원하는 위치에 압축을 풀고 환경변수를 설정한다.

## Terraform에서 LocalStack 설정

Terraform에서 LocalStack을 연결하는 방법은 2가지가 있는데 첫번째는 기본 `terraform` 명령어를 사용하는 것이고 2번째는 LocalStack에서 제공하는 `tflocal`을 사용하는 것이다.

`tflocal`을 사용하고자 한다면 아래의 아래의 명령어들에서 `terraform` 부분을 `tflocal`로 바꾸어 실행하면 된다.

Terraform을 사용할 폴더를 만들고 그 안에 아래의 명령어를 실행하여 초기화를 한다.

```shell
terraform init
```

Terraform의 파일 확장자는 `.tf`를 사용한다. 해당 확장자로 파일을 하나 만든다.

기본 `terraform`을 사용하고자 한다면 해당 파일에 [Terraform | Docs](https://docs.localstack.cloud/user-guide/integrations/terraform/#endpoint-configuration) 해당 링크에 있는 것처럼 provider와 endpoints를 설정한다.

해당 tf파일에 아래의 내용을 작성한다.

```hcl
resource "aws_instance" "test" {
  instance_type = "t2.micro"
  ami           = "ami-000001"
}
```

이후 아래의 명령어를 실행하여 LocalStack에 적용시켜본다.

```shell
terraform apply
```

성공적으로 되었다면 웹의 EC2 리소스 브라우저에서 확인할 수 있을 것이다.

## LocalStack과 실제 AWS 클라우드의 장단점

| 장점                                                                                                | 단점                                                         |
|:------------------------------------------------------------------------------------------------- |:---------------------------------------------------------- |
| - AWS를 직접 올리지 않아도 테스트가 가능하여 저렴한 가격에 여러 환경을 구성해 볼 수 있음<br/>- 실제 클라우드 환경에 배포되는 시간이 단축되어 빠른 테스트가 가능함 | - LocalStack은 AWS를 시뮬레이션하는 것이기 때문에 실제 클라우드에서는 작동하지 않을 수 있음 |
