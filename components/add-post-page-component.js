import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    //Реализовываем страницу добавления поста (разметка)
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
      </div> 
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
  `
  ;
    appEl.innerHTML = appHtml;

    let imageUrl;

    renderUploadImageComponent({
      element:appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    //рендер заголовка (здесь проблема)
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });


    document.getElementById("add-button").addEventListener("click", () => {
      const descriptionElem = document.getElementById('description-input').value;

      if(!imageUrl) {
        alert('Загрузите изображение');
        return
      }
      
      if(!descriptionElem) {
        alert('Добавьте описание к изображению');
        return;
      }

      onAddPostClick({ 
        description: descriptionElem
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;"), 
        imageUrl: imageUrl 
      });
    });

  };

  render();
}

