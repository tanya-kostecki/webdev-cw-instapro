// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "tanya-kostecki";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

//запрос на получение всех постов
export async function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts.map((post) => {
        return {
          name: post.user.name,
          description: post.description,
          time: post.createdAt,
          postImage: post.imageUrl,
          userImage: post.user.imageUrl,
          id: post.user.id,
          idPost: post.id,
          isLiked: post.isLiked,
          likes: post.likes.length,
        };
      });
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
//запрос на регистрацию нового пользователя
export async function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

//запрос на авторизацию пользователя
export async function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export async function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

//получить все посты конкретного пользователя
export async function getUserPosts({ token, userId }) {
  return fetch(postsHost + "/user-posts/" + userId, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts.map((post) => {
        return {
          name: post.user.name,
          description: post.description,
          time: post.createdAt,
          postImage: post.imageUrl,
          userImage: post.user.imageUrl,
          id: post.user.id,
          idPost: post.id,
          isLiked: post.isLiked,
          likes: post.likes.length,
        };
      });
    });
};

//запрос на добавление поста
export async function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      imageUrl,
      description
    }),
  })
  .then((response) => {
    if(response.status === 400) {
      throw new Error('Заргузите и опишите фотографию');
    }

    return response.json();
  });
};

//запрос на добавлениия лайка
export async function addLike({ token, idPost }) {
  return fetch(postsHost + "/" + idPost + "/like", {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({ 
      idPost 
    }),
  })
  .then((response) => {
    return response.json();
  })
};

//запрос на удаление лайка
export async function removeLike({ token, idPost }) {
  return fetch(postsHost + "/" + idPost + "/dislike", {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({ 
      idPost
    }),
  })
  .then((response) => {
    return response.json();
  })
};


