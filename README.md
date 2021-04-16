## 1. 프로젝트 소개

### 1) 사용한 데이터셋
https://www.notion.so/Data-dba582f6d5a44c8d973738f55daa821c

  (1) 다문화- 일반가정 예방접종 비교. 
  출처: 취약계층 아동 예방접종 현황 및 장애요인 조사사업,  이화여자대학교  산학협력단

  다문화가정 자녀와 일반가정 자녀와의 예방접종률에 있어서 명확한 차이가 드러남.
  즉, 예방접종이라는 의료혜택에 있어서 다문화 가정 자녀들이 의료사각지대에 있음을 뒷받침한다.

  (2) 자가응답에 의한 다문화가정아동의 예방접종 장애요인
  출처: 상동

  (3) 한국거주 외국인들의 상담 내역(상담 분야, 사용 언어)

  (4) 전국 다문화가정의 국적 분포


### 2) 기술스택 
  python, Mysql, react, flask 

### 3) 라이브러리 
  numpy, pandas, matplotlib, chakra


#### 4) 웹서비스에 대한 개요:
  다문화 가정을 위한 예방점종에 대한 각종 편의를 제공하는 서비스 




## 2. 프로젝트 목표

### 1) 프로젝트 아이디어 동기
  데이터를 통한 인사이트:
  다문화 가정 예방접종률이 낮은 이유로,  과반수 이상이
  (1) 예방접종을 해야 할 시기를 몰라서 
  (2) 예방접종 시기를 기억하기 어려워서
  를 이유로 들었으므로 이를 해소하기 위한 프로젝트를 기획하였다.

### 2). 문제를 해결하기 위한  질문 및 대답
  Q. 다문화 가정 예방접종률을 높이기 위해서는 어떻게 해야 하는가?   
  A. 일정을 관리할 수 있게 하기 / 병원 정보 제공하기     
     
  Q. 다문화가정의 언어 소통 문제는 어떻게 해결할까?      
  A. 사이트 국제화 도입    
      
  Q. 그렇다면 다문화 가정 중 가장 많은 비율의 국적이 어디인가?   
  A. 데이터 분석을 통해 베트남인 것을 알아냄   
      
  Q. 백신을 맞을 병원에 대한 정보 제공은 어떻게 이루어져야 되는가?   
  A. 병원 검색 서비스를 도입   



## 3. 프로젝트 기능 설명

### 1) 주요기능:

  (1) 한국어, 영어, 베트남어 등 다양한 언어지원

  (2) 캘린더를 통한 예방접종 일정 관리 서비스

  (3) 지도에 백신을 보유한 병원을 보여주고 검색 시 해당 병원의 정보(위치, 전화번호, 보유백신) 제공


### 2) 프로젝트만의 차별점, 기대 효과

  (1) 차별점.   
  
    기존의 다문화 의료사각지대해소 서비스 문자메시지나 오프라인 위주   
    문자메시지의 단점: 다른 서비스와의 확장성 및 연결성이 부족   
    오프라인의 단점: 사용자의 편의성 측면에서 한계  
    따라서 해당 서비스들을 온라인으로 옮겨 사용자들의 편의성을 증진      
    추후 다문화 가정을 위한 온라인플랫폼으로의 확장가능성 및 연결성을 확보  
    국제화 도입으로 인해 언어 소통의 문제 해결   


  (2) 기대효과
    다문화 가정의 의료정보 비대칭 해소   
   
   
## 4. 프로젝트 구성도
[프로젝트 구성도 링크](https://ovenapp.io/view/aUfENOzE0qnnn0G8vwqDNidx4j5kiEM0/Johv1)

## 5. 프로젝트 팀원 역할 분담




| 이름 | 담당 업무 |
| ------ | ------ |
|정성헌 | 리더/백엔드 개발 |
|남다영 | 프론트엔드 |
|김윤주 | 백엔드/데이터분석 |
|심재민 | 백엔드/데이터분석 |


**멤버별 responsibility(R&R, Role and Responsibilities)**

1. 리더 

- 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
- 개발 단계: 팀원간의 일정 등 조율 + 프론트 or 백엔드 개발
- 수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비

2. 프론트엔드 

- 기획 단계: 큰 주제에서 문제 해결 아이디어 도출, 데이터 수집, 와이어프레임 작성
- 개발 단계: 와이어프레임을 기반으로 구현, 데이터 처리 및 시각화 담당, UI 디자인 완성
- 수정 단계: 피드백 반영해서 프론트 디자인 수정

 3. 백엔드 & 데이터 담당  

- 기획 단계: 기획 데이터 분석을 통해 해결하고자 하는 문제를 정의
- 개발 단계: 웹 서버 사용자가 직접 백엔드에 저장할수 있는 기능 구현, 데이터 베이스 구축 및 API 활용, 데이터 분석 개념 총동원하기
- 수정 단계: 코치님 피드백 반영해서 분석/ 시각화 방식 수정

## 6. 버전
  - 1.0


## 7. FAQ
  - 자주 받는 질문 정리
