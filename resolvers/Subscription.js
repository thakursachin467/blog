
import authorization from '../Utils/Authorization';
const Subscription = {
  comment: {
    subscribe(parent, args, { database, request }, info) {
      return database.subscription.comment({
        where:
        {
          node:
          {
            post:
            {
              id:
                args.postId
            }
          }
        }
      }, info)
    }
  },
  post: {
    subscribe(parent, args, { database }, info) {
      return database.subscription.post({
        where:
        {
          node:
          {
            Published: true
          }
        }
      }, info)
    }
  },
  myPost: {
    subscribe(parent, args, { database, request }, info) {
      const userId = authorization(request);
      return database.subscription.post({
        where:
        {
          node: {
            author: {
              id: userId
            }
          }
        }
      }, info)
    }
  }

}
export { Subscription as default }