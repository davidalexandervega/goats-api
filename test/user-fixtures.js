const makeUser = {

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
      password: 'alienspassword123',
      email: `alexandrabrinncampbell@gmail.com`,
    }
  },

  signinGood() {
    return {
      username: 'testuser',
      password: 'testuserpassword123'
    }
  },

  signinGood2() {
    return {
      username: 'aliens',
      password: 'alienspassword123'
    }
  },

  signinBad() {
    return {
      username: 'testuser',
      password: 'badtestuserpassword123'
    }
  },

  postResp() {
    return {
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
    }
  },


  patchBody() {
    return {
      username: 'nowtestuser',
      password: 'newpassword123',
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

module.exports = { makeUser }
