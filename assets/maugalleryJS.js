(function () {
    function MauGallery(element, options) {
      this.element = element;
      this.options = Object.assign({}, MauGallery.defaults, options);
      this.tagsCollection = [];
      this.init();
    }
  
    MauGallery.defaults = {
      columns: 3,
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: "bottom",
      navigation: true
    };
  
    MauGallery.prototype.init = function () {
      this.createRowWrapper();
      if (this.options.lightBox) {
        this.createLightBox();
      }
      this.listeners();
      const galleryItems = this.element.querySelectorAll('.gallery-item');
      galleryItems.forEach((item, index) => {
        this.responsiveImageItem(item);
        this.moveItemInRowWrapper(item);
        this.wrapItemInColumn(item);
        const theTag = item.dataset.galleryTag;
        if (this.options.showTags && theTag && !this.tagsCollection.includes(theTag)) {
          this.tagsCollection.push(theTag);
        }
      });
      if (this.options.showTags) {
        this.showItemTags();
      }
      this.element.style.display = 'block';
    };
  
    MauGallery.prototype.createRowWrapper = function () {
      const rowWrapper = document.createElement('div');
      rowWrapper.classList.add('gallery-items-row', 'row');
      this.element.appendChild(rowWrapper);
    };
  
    MauGallery.prototype.wrapItemInColumn = function (element) {
      const columnDiv = document.createElement('div');
      columnDiv.classList.add('item-column', 'mb-4');
      if (typeof this.options.columns === 'number') {
        columnDiv.classList.add(`col-${Math.ceil(12 / this.options.columns)}`);
      } else if (typeof this.options.columns === 'object') {
        if (this.options.columns.xs) columnDiv.classList.add(`col-${Math.ceil(12 / this.options.columns.xs)}`);
        if (this.options.columns.sm) columnDiv.classList.add(`col-sm-${Math.ceil(12 / this.options.columns.sm)}`);
        if (this.options.columns.md) columnDiv.classList.add(`col-md-${Math.ceil(12 / this.options.columns.md)}`);
        if (this.options.columns.lg) columnDiv.classList.add(`col-lg-${Math.ceil(12 / this.options.columns.lg)}`);
        if (this.options.columns.xl) columnDiv.classList.add(`col-xl-${Math.ceil(12 / this.options.columns.xl)}`);
      }
      element.parentNode.insertBefore(columnDiv, element);
      columnDiv.appendChild(element);
    };
  
    MauGallery.prototype.moveItemInRowWrapper = function (element) {
      const rowWrapper = this.element.querySelector('.gallery-items-row');
      rowWrapper.appendChild(element.parentElement);
    };
  
    MauGallery.prototype.responsiveImageItem = function (element) {
      if (element.tagName === 'IMG') {
        element.classList.add('img-fluid');
      }
    };
  
    MauGallery.prototype.createLightBox = function () {
      const lightboxId = this.options.lightboxId || 'galleryLightbox';
      const modalDiv = document.createElement('div');
      modalDiv.classList.add('modal', 'fade');
      modalDiv.id = lightboxId;
      modalDiv.tabIndex = -1;
      modalDiv.setAttribute('role', 'dialog');
      modalDiv.setAttribute('aria-hidden', 'true');
  
      const modalDialogDiv = document.createElement('div');
      modalDialogDiv.classList.add('modal-dialog');
      modalDialogDiv.setAttribute('role', 'document');
  
      const modalContentDiv = document.createElement('div');
      modalContentDiv.classList.add('modal-content');
  
      const modalBodyDiv = document.createElement('div');
      modalBodyDiv.classList.add('modal-body');
  
      if (this.options.navigation) {
        const prevDiv = document.createElement('div');
        prevDiv.classList.add('mg-prev');
        prevDiv.style.cursor = 'pointer';
        prevDiv.style.position = 'absolute';
        prevDiv.style.top = '50%';
        prevDiv.style.left = '-15px';
        prevDiv.style.background = 'white';
        prevDiv.textContent = '<';
        prevDiv.addEventListener('click', () => this.prevImage());
        modalBodyDiv.appendChild(prevDiv);
      }
  
      const lightboxImage = document.createElement('img');
      lightboxImage.classList.add('lightboxImage', 'img-fluid');
      lightboxImage.alt = 'Contenu de l\'image affichée dans la modale au clique';
      modalBodyDiv.appendChild(lightboxImage);
  
      if (this.options.navigation) {
        const nextDiv = document.createElement('div');
        nextDiv.classList.add('mg-next');
        nextDiv.style.cursor = 'pointer';
        nextDiv.style.position = 'absolute';
        nextDiv.style.top = '50%';
        nextDiv.style.right = '-15px';
        nextDiv.style.background = 'white';
        nextDiv.textContent = '>';
        nextDiv.addEventListener('click', () => this.nextImage());
        modalBodyDiv.appendChild(nextDiv);
      }
  
      modalContentDiv.appendChild(modalBodyDiv);
      modalDialogDiv.appendChild(modalContentDiv);
      modalDiv.appendChild(modalDialogDiv);
      this.element.appendChild(modalDiv);
    };
  
    MauGallery.prototype.showItemTags = function () {
      let tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      this.tagsCollection.forEach((value) => {
        tagItems += `<li class="nav-item"><span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
      });
  
      const tagsRow = document.createElement('ul');
      tagsRow.classList.add('my-4', 'tags-bar', 'nav', 'nav-pills');
      tagsRow.innerHTML = tagItems;
  
      if (this.options.tagsPosition === 'bottom') {
        this.element.appendChild(tagsRow);
      } else if (this.options.tagsPosition === 'top') {
        this.element.insertBefore(tagsRow, this.element.firstChild);
      } else {
        console.error(`Unknown tags position: ${this.options.tagsPosition}`);
      }
  
      tagsRow.addEventListener('click', this.filterByTag.bind(this));
    };
  
    MauGallery.prototype.filterByTag = function (event) {
      const target = event.target;
      if (target.classList.contains('active-tag')) return;
  
      document.querySelector('.active').classList.remove('active');
      target.classList.add('active');
  
      const tag = target.dataset.imagesToggle;
      const galleryItems = this.element.querySelectorAll('.gallery-item');
      galleryItems.forEach((item) => {
        const itemColumn = item.parentElement;
        itemColumn.style.display = 'none';
        if (tag === 'all' || item.dataset.galleryTag === tag) {
          itemColumn.style.display = 'block';
        }
      });
    };
  
    MauGallery.prototype.prevImage = function () {
      this.navigateImage('prev');
    };
  
    MauGallery.prototype.nextImage = function () {
      this.navigateImage('next');
    };
  
    MauGallery.prototype.navigateImage = function (direction) {
      const activeImageSrc = document.querySelector('.lightboxImage').src;
      const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
      const activeIndex = galleryItems.findIndex((item) => item.src === activeImageSrc);
      let newIndex;
  
      if (direction === 'prev') {
        newIndex = activeIndex > 0 ? activeIndex - 1 : galleryItems.length - 1;
      } else {
        newIndex = activeIndex < galleryItems.length - 1 ? activeIndex + 1 : 0;
      }
  
      document.querySelector('.lightboxImage').src = galleryItems[newIndex].src;
    };
  
    MauGallery.prototype.listeners = function () {
      const galleryItems = this.element.querySelectorAll('.gallery-item');
      galleryItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          if (this.options.lightBox && e.target.tagName === 'IMG') {
            this.openLightBox(e.target);
          }
        });
      });
    };
  
    MauGallery.prototype.openLightBox = function (element) {
      const lightboxImage = document.querySelector(`#${this.options.lightboxId} .lightboxImage`);
      lightboxImage.src = element.src;
      const modal = new bootstrap.Modal(document.getElementById(this.options.lightboxId));
      modal.show();
    };
  
    // Initialize the plugin
    window.MauGallery = MauGallery;
  
    // Example usage
    document.addEventListener("DOMContentLoaded", function () {
      const gallery = document.querySelector('.gallery');
      if (gallery) {
        new MauGallery(gallery, {
          columns: 3,
          lightBox: true,
          lightboxId: 'galleryLightbox',
          showTags: true,
          tagsPosition: 'bottom',
          navigation: true
        });
      }
    });
  })();
  