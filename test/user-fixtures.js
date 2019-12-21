const getUuid = require('uuid-by-string')

function makeUsers() {
  return [
    {
      id: `${getUuid('Hello killer')}`,
      username: 'killer',
      password: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764
    },
    {
      id: `${getUuid('Hello aliens')}`,
      username: 'aliens',
      password: `alienspassword`,
      email: `alexandrabrinncampbell@gmail.com`,
      fullname: 'Ali Campbell',
      city_id: 1792756324
    },
  ]
}

const makeUser = {
  good() {
    return {
      id: `${getUuid('Hello killer')}`,
      username: 'killer',
      password: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
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

  withXss() {
    return {
      id: `${getUuid('Hello killer')}`,
      username: 'killer naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      password: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764
    }
  },

  withSanitizedXss() {
    return {
      id: `${getUuid('Hello killer')}`,
      username: 'killer naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
      password: `killerpassword`,
      email: `killeraliens@outlook.com`,
      fullname: 'Orlando Garcia',
      city_id: 1392685764
    }
  }


}

module.exports = { makeUsers, makeUser }
