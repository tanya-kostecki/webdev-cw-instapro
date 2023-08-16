import { addLike, addPost, getPosts, getUserPosts, removeLike, deletePost } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { renderUserPageComponent } from "./components/user-post-component.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // TODO: реализовать получение постов юзера из API +
      // console.log("Открываю страницу пользователя: ", data.userId);
      //Страница загрузки
      page = LOADING_PAGE;
      renderApp();

      //загрузка страницы с постом пользователя
      let userId = data.userId;

      return getUserPosts({ userId, token: getToken() })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(USER_POSTS_PAGE);
        });
    }
    page = newPage;
    renderApp();

    return;
  }

  addRemoveLikeListener();
  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // TODO: реализовать добавление поста в API +
        // console.log("Добавляю пост...", { description, imageUrl });
        addPost({
          description,
          imageUrl,
          token: getToken(),
        }). then(()=> {
            goToPage(POSTS_PAGE);
        }); 
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографию пользвателя
    // appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    // return;
    return renderUserPageComponent({
      appEl,
    });
  }
  addRemoveLikeListener();
};

//Реализация функционала лайков
export const addRemoveLikeListener = () => {
  const likeButtons = document.querySelectorAll('.like-button');
  for(const likeButton of likeButtons) {
    likeButton.addEventListener('click', () => {
      const index = likeButton.dataset.index;
      console.log(index);

      let idPost = posts[index].idPost;
      let userId = posts[index].id;

      if(posts[index].isLiked === false) {
        addLike({ idPost, token: getToken() })
          .then(() => {
            if(page === POSTS_PAGE) {
              goToPage(POSTS_PAGE);
            } 

            if(page === USER_POSTS_PAGE) {
              goToPage(USER_POSTS_PAGE, { userId: userId });
            }
           
          });
      } else {
        removeLike({ idPost, token: getToken() })
          .then(() => {
            if(page === POSTS_PAGE) {
              goToPage(POSTS_PAGE);
            } 

            if(page === USER_POSTS_PAGE) {
              goToPage(USER_POSTS_PAGE, { userId: userId });
            }
            
          });
      }
    });
  }
};

//Реализация удаление поста
export const deletePostListener = () => {
  const deleteButtons = document.querySelectorAll('.delete-button');
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', () => {
      const index = deleteButton.dataset.index;
      let userId = posts[index].id;
      let idPost = posts[index].idPost;

      deletePost({ idPost, token: getToken() })

      if(page === POSTS_PAGE) {
        goToPage(POSTS_PAGE);
      }

      if(page === USER_POSTS_PAGE) {
        goToPage(USER_POSTS_PAGE, { userId: userId });
      }
    });
  }
}

goToPage(POSTS_PAGE);
addRemoveLikeListener();
deletePostListener();
