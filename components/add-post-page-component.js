import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";


export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // renderHeaderComponent({ element });
    // TODO: Реализовываем страницу добавления поста (разметка)
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
        <div class="form">
          <h3 class="form-title>Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container">
              <div class="upload=image">
                <label class="file-upload-label secondary-button"><input type="file" class="file-upload-input" style = "display:none">Выберите фото</label>
              </div>
            </div>
          </div>
          <label>Опишите фотографию:<textarea class="input textarea" id="description-input" rows="4"></textarea></label>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div> 
    </div>
  `;

    appEl.innerHTML = appHtml;

    let imageUrl; //Заргуженное изображение
    const uploadImageContainer = appEl.querySelector('.upload-image-container'); //Компонент загрузки фотографии
    const descriptionElem = document.getElementById('description-input');

    if(uploadImageContainer) {
      renderUploadImageComponent({
        element:appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        //Закрытие всех уязвимостей при вводе
        description: descriptionElem.value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
        imageUrl: imageUrl,
      });
    });
  };

  render();
  
}
