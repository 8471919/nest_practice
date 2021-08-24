//미들웨어 A~Z

//router// A -> B -> C -> D

//router// A -> C -> D

//router// A -> E -> F -> D -> G

//router// Z -> A -> X -> D

// 네 개의 라우터의 공통점 : A가 먼저 실행되고, 끝 즈음엔 D가 실행된다.

// 인터셉터 : 새로로 나오는 미들웨어를 중복을 제거하는 기능을 수행

// 컨트롤러 실행 전, 후로 특정동작을 넣어줄 수 있다.

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class undefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // controller 들어가기 전 부분

    /* controller 실행되고 난 후는 handle() 다음에 작성하면 된다.
    data는 controller에서 return해주는 데이터이다.
    만약, data === user 라면, { data : user, code: 'SUCCESS' }로 가공
    return next.handle().pipe(map((data) => ({ data, code: 'SUCCESS' }))); */

    //인터셉터의 이름이 undefinedToNullInterceptor 이기 때문에
    //json은 undefined를 취급하지않고 null만 취급하기 때문에 undefined가 있으면 null로 바꿔준다.
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
  }
}
