function makeUsers() {
  return [
    {
      id: 1,
      username: 'killer',
      password_digest: `killerpasswordNOTHASHED`,
      token: 'notRealToken',
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764,
      admin: false,
    },
    {
      id: 2,
      username: 'aliens',
      password_digest: `alienspasswordNOTHASHED`,
      token: 'notRealToken',
      email: `alexandrabrinncampbell@gmail.com`,
      fullname: 'Ali Campbell',
      city_id: 1792756324,
      admin: false,
    },
  ]
}

const makeUser = {
  good() {
    return {
      id: 1,
      username: 'killer',
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764,
      admin: false
    }
  },

  signedInRes() {
    return {
      id: 1,
      username: 'killer',
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764,
      token: 'notNull',
      admin: false,
    }
  },

  postBody() {
    return {
      username: 'killer',
      password: `killerpassword`,
      email: `killeraliens@outlook.com`,
    }
  },

  postBody2() {
    return {
      username: 'aliens',
      password: `alienspassword`,
      email: `alexandrabrinncampbell@gmail.com`,
    }
  },

  patchBody() {
    return {
      username: 'nowkiller',
      password: 'newkillerpassword',
      email: 'newemail',
      city_id: 1792756324,
      admin: true //should not be patchable
    }
  },

  patchBodyMissingField() {
    return {
      notafield: 'bad field'
    }
  },

  postResp() {
    return {
      id: 1,
      username: 'killer',
      email: `killeraliens@outlook.com`,
      admin: false,
      city_id: null,
      token: 'notnull'
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
      city_id: 1392685764,
      admin: false
    }
  },

  withSanitizedXss() {
    return {
      id: 1,
      username: 'killer naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
      password_digest: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764,
      admin: false
    }
  }


}

module.exports = { makeUsers, makeUser }
