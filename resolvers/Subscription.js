

const Subscription = {
  comment: {
    subscribe(parent, args, { database }, info) {
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
  }

}
export { Subscription as default }