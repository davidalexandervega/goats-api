function makeUsers() {
  return [
    {
      id: 1,
      username: 'killer',
      password_digest: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764
    },
    {
      id: 2,
      username: 'aliens',
      password_digest: `alienspassword`,
      email: `alexandrabrinncampbell@gmail.com`,
      fullname: 'Ali Campbell',
      city_id: 1792756324
    },
  ]
}

const makeUser = {
  good() {
    return {
      id: 1,
      username: 'killer',
      password_digest: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764
    }
  },

  signedInRes() {
    return {
      id: 1,
      username: 'killer',
      city_id: 1392685764
    }
  },

  postBody() {
    return {
      username: 'killer',
      password: `killerpassword`,
      email: `killeraliens@outlook.com`,
    }
  },

  signinGood() {
    return {
      username: 'killer',
      password: 'killerpassword'
    }
  },

  withXss() {
    return {
      id: 1,
      username: 'killer naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      password_digest: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764
    }
  },

  withSanitizedXss() {
    return {
      id: 1,
      username: 'killer naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
      password_digest: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764
    }
  }


}

module.exports = { makeUsers, makeUser }
