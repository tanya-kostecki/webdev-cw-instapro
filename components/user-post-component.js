import { addRemoveLikeListener, posts } from "../index.js";
import { renderHeaderComponent } from "./header-component.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";


export function renderUserPageComponent({ appEl }) {
    // TODO: реализовать рендер постов из api +
    // console.log("Актуальный список постов:", posts);
    //Cоздаем разметку для каждого поста из массива posts
    const postsHtml =  posts.map((post, index) => {
      const createDate = (formatDistanceToNow(new Date(post.time), { locale: ru }) + ` назад`);
      return `<li class="post">
      <div class="post-header" data-user-id="${post.id}">
          <img src="${post.userImage}" class="post-header__user-image">
          <p class="post-header__user-name">${post.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.postImage}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.idPost}" class="like-button" data-index="${index}">
          <img src="${post.isLiked ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg`}">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
        ${createDate}
      </p>
    </li>`
    })
  
    /**
     * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
     * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
     */
    const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  <ul class="posts">
                    ${postsHtml}
                  </ul>
                </div>`;
  
    appEl.innerHTML = appHtml;
  
    //рендер заголовка
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    addRemoveLikeListener();
  }
  