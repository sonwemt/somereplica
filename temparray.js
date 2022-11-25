const oldArr = [
  {
    title: "First user submitted post",
    content: "linkplaceholder",
    id: "post1",
    comments: [
      {
        username: "User1",
        comment: "Lorem ipsum",
        id: "post1comment1",
        index: 0,
        votes: {
          up: 1,
          down: 0,
        }
      },
      {
        username: "User2",
        comment: "Lorem ipsum",
        id: "post1comment2",
        index: 1,
        votes: {
          up: 1,
          down: 0, 
        }
      },
    ],
    index: 0,
    linkExternal: false,
    votes: {
      up: 1,
      down: 0,
    }
  },
  {
    title: "Second user submitted post",
    content: "linkplaceholder",
    id: "post2",
    comments: [
      {
        username: "User1",
        comment: "Lorem ipsum",
        id: "post2comment1",
        index: 0,
        votes: {
          up: 1,
          down: 0,
        },
      },
      {
        username: "User2",
        comment: "Lorem ipsum",
        id: "post2comment2",
        index: 1,
        votes: {
          up: 1,
          down: 0,
        },
      },
    ],
    index : 1,
    linkExternal: false,
    votes: {
      up: 1,
      down: 0,
    }
  },
  {
    title: "Third user submitted post",
    content: "linkplaceholder",
    id: "post3",
    comments: [
      {
        username: "User1",
        comment: "Lorem ipsum",
        id: "post3comment1",
        index: 0,
        votes: {
          up: 1,
          down: 0,
        }
      },
      {
        username: "User2",
        comment: "Lorem ipsum",
        id: "post3comment2",
        index: 1,
        votes: {
          up: 1,
          down: 0,
        }
      },
    ],
    index: 2,
    linkExternal: false,
    votes: {
      up: 1,
      down: 0,
    }
  },
  {
    title: "Fourth user submitted post - external link",
    content: "https://www.google.com",
    id: "post4",
    comments: [
      {
        username: "User1",
        comment: "Lorem ipsum",
        id: "post4comment1",
        index: 0,
        votes: {
          up: 1,
          down: 0,
        }
      },
      {
        username: "User2",
        comment: "Lorem ipsum",
        id: "post4comment2",
        index: 1,
        votes: {
          up: 1,
          down: 0,
        }
      },
    ],
    index: 3,
    linkExternal: true,
    votes: {
      up: 1,
      down: 0,
    }
  },
]