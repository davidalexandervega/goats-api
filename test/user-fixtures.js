// function makeUsers() {
//   return [
//     {
//       id: 1,
//       username: 'killer',
//       password_digest: `$2a$10$woR.meJcG0nFVI/kmuSgiurGz.LnwJx0VrCYVtLWaPF1rs5lRJF66`, //killerpassword123
//       token: 'notRealToken',
//       email: `killeraliens@outlook.com`,
//       fullname: 'Orlando Garcia',
//       city_id: 1392685764,
//       admin: false,
//     },
//     {
//       id: 2,
//       username: 'aliens',
//       password_digest: `$2a$10$HgAo1uMvj3GpfuTAPgXQ1evGCKOkYRTnn1WgfPkhgF0qCUiNw2E4G`,
//       token: 'notRealToken',
//       email: `alexandrabrinncampbell@gmail.com`,
//       fullname: 'Ali Campbell',
//       city_id: 1792756324,
//       admin: false,
//     },
//   ]
// }

const makeUser = {
//   seeded1() {
//     return {
//       id: 1, //not part of seed
//       password: 'killerpassword123', //not part of seed
//       username: 'killer',
//       email: 'killeraliens@outlook.com',
//       password_digest: '$2a$10$woR.meJcG0nFVI/kmuSgiurGz.LnwJx0VrCYVtLWaPF1rs5lRJF66',
//       last_login: '2019-11-30T19:14:17.915Z',
//       created: '2019-10-30T19:14:17.915Z',
//       modified: '2019-10-30T19:14:17.915Z'
//     }
//   },

  // seeded2() {
  //   return {
  //     id: 2, //not part of seed
  //     password: 'alienspassword123', //not part of seed
  //     username: 'aliens',
  //     email: 'alexandrabrinncampbell@gmail.com',
  //     password_digest: '$2a$10$HgAo1uMvj3GpfuTAPgXQ1evGCKOkYRTnn1WgfPkhgF0qCUiNw2E4G',
  //     last_login: '2019-08-30T19:14:17.915Z',
  //     created: '2019-07-30T19:14:17.915Z',
  //     modified: '2019-07-30T19:14:17.915Z'
  //   }
  // },

  postBody() {
    return {
      username: 'testuser',
      password: 'testuserpassword123',
      email: 'testuseraliens@outlook.com',
    }
  },

  postBody2() {
    return {
      username: 'aliens',
      password: `alienspassword123`,
      email: `alexandrabrinncampbell@gmail.com`,
    }
  },

  postResp() {
    return {
      // id: 'uuiddefault',
      username: 'testuser',
      email: `testuseraliens@outlook.com`,
      admin: false,
      image_url: '',
      fullname: '',
      city_name: '',
      region_name: '',
      country_name: '',
      city_id: null,
      user_state: 'Public'
      // token: 'cryptotokencustom',
      // created: 'createddefault',
      // modified: 'modifieddefault',
      // last_login:  'lastlogindefault'
    }
  },

  signinGood() {
    return {
      username: 'testuser',
      password: 'testuserpassword123'
    }
  },

  signinBad() {
    return {
      username: 'testuser',
      password: 'badtestuserpassword123'
    }
  },

  // postBodyPasswordNoNumbers() {
  //   return {
  //     username: 'killer',
  //     password: `killerpassword`,
  //     email: `killeraliens@outlook.com`,
  //   }
  // },

  // postBodyPasswordTooShort() {
  //   return {
  //     username: 'killer',
  //     password: `kill`,
  //     email: `killeraliens@outlook.com`,
  //   }
  // },

  // postBodyBadEmail() {
  //   return {
  //     username: 'killer',
  //     password: `killerpassword123`,
  //     email: `https://notanemail.com`,
  //   }
  // },

  patchBody() {
    return {
      username: 'nowtestuser',
      password: 'nowtestuserpassword123',
      email: 'nowemail@outlook.com',
      image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1579765539/bc3tfkvu9yyhc1kfhnfv.jpg',
      fullname: 'New Full Name',
      city_name: 'Ankara',
      region_name: 'Anatolia',
      country_name: 'Turkey',
      city_id: 1528992666,
      user_state: 'Banned', //should not be patchable
      admin: true //should not be patchable
    }
  },

  patchBodyMissingField() {
    return {
      notafield: 'bad field'
    }
  },


  withXss() {
    return {
      username: 'testuser naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      image_url: 'testuseraliens@outlook.com naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      city_name: 'Ghent naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      region_name: 'East Flanders naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      country_name: 'Belgium naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.'
    }
  },

  withSanitizedXss() {
    return {
      username: 'testuser naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
      image_url: 'testuseraliens@outlook.com naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
      city_name: 'Ghent naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
      region_name: 'East Flanders naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
      country_name: 'Belgium naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
    }
  }


}

// module.exports = { makeUsers, makeUser }

module.exports = { makeUser }
