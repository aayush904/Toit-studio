if (!customElements.get("quick-add-modal")) {
  customElements.define(
    "quick-add-modal",
    class QuickAddModal extends ModalDialog {
      constructor() {
        super();
        this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

        this.addEventListener("product-info:loaded", ({ target }) => {
          target.addPreProcessCallback(this.preprocessHTML.bind(this));
        });
      }

      hide(preventFocus = false) {
        const cartNotification =
          document.querySelector("cart-notification") ||
          document.querySelector("cart-drawer");
        if (cartNotification) cartNotification.setActiveElement(this.openedBy);
        this.modalContent.innerHTML = "";

        if (preventFocus) this.openedBy = null;
        super.hide();
      }

      show(opener) {
        opener.setAttribute("aria-disabled", true);
        opener.classList.add("loading");
        opener.querySelector(".loading__spinner").classList.remove("hidden");

        fetch(opener.getAttribute("data-product-url"))
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            const productElement = responseHTML.querySelector("product-info");

            this.preprocessHTML(productElement);
            HTMLUpdateUtility.setInnerHTML(
              this.modalContent,
              productElement.outerHTML
            );

            const productDataScript = this.modalContent.querySelector(
              'script[id^="ProductData-"]'
            );
            let productData = null;
            if (productDataScript) {
              try {
                productData = JSON.parse(productDataScript.textContent);
              } catch (e) {
                productData = null;
                console.error("Failed to parse ProductData JSON:", e);
              }
            }

            if (
              productData &&
              Array.isArray(productData.media) &&
              productData.media.length > 0
            ) {
              const slider = document.createElement("div");
              slider.className = "quickadd-media-slider";
              slider.setAttribute("data-slick-slider", "true");
              slider.style.overflow = "auto";
              slider.style.whiteSpace = "nowrap";
              slider.style.margin = "1em 0";
              slider.style.paddingRight = "20px";

              productData.media.forEach((media) => {
                if (media.media_type === "image" && media.src) {
                  const img = document.createElement("img");
                  img.src = media.src;
                  img.alt = media.alt || "";
                  img.style.marginRight = "8px";
                  img.style.display = "inline-block";
                  img.style.borderRadius = "8px";
                  const slide = document.createElement("div");
                  slide.dataset.id = media.id || "";
                  slide.appendChild(img);
                  slider.appendChild(slide);
                }

              });

              const priceElem =
                this.modalContent.querySelector('[id^="price-"]');
              if (priceElem && slider.childNodes.length > 0) {
                priceElem.parentNode.insertBefore(
                  slider,
                  priceElem.nextSibling
                );
              }
            }

            $(".quickadd-media-slider").slick({
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              loop: true,
              arrows: true,
              dots: false,
              nextArrow:
                '<button style="right:5px; top:50%; transform:translateY(-50%)" type="button" class="slick-next slick-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192" fill="none"> <path d="M30 96H162" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> <path d="M108 42L162 96L108 150" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> </svg></button>',
              prevArrow:
                '<button style="left:5px; top:50%; transform:translateY(-50%)" type="button" class="slick-prev slick-arrow"><svg xmlns="http://www.w3.org/2000/svg" transform="rotate(180)" width="192" height="192" viewBox="0 0 192 192" fill="none"> <path d="M30 96H162" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> <path d="M108 42L162 96L108 150" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> </svg></button>',
            });

            const infoWrapper = this.modalContent.querySelector(
              ".product__info-wrapper"
            );
            const buyBtn = this.modalContent.querySelector(".product-buy-btn");
            const viewDetailBtn = this.modalContent.querySelector(
              ".product__view-details"
            );

            if (infoWrapper) {

              const footerQuickAdd = document.createElement("div");
              footerQuickAdd.className = "footer-quick-add";

              if (buyBtn) {
                footerQuickAdd.appendChild(buyBtn);
              }

              if (viewDetailBtn) {
                footerQuickAdd.appendChild(viewDetailBtn);
              }

              if (infoWrapper.parentNode) {
                infoWrapper.parentNode.insertBefore(
                  footerQuickAdd,
                  infoWrapper.nextSibling
                );
              }
            }

            const descElem = this.modalContent.querySelector(
              ".product__description"
            );
            if (descElem) {
              let text = descElem.textContent || "";

              text = text.replace(/\s+/g, " ").trim();
              const words = text.split(" ");
              if (words.length > 30) {
                descElem.textContent = words.slice(0, 30).join(" ") + "...";
              } else {
                descElem.textContent = text;
              }
            }

            if (window.Shopify && Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }
            if (window.ProductModel) window.ProductModel.loadShopifyXR();

            super.show(opener);

            this.setupQuickAddMediaSliderSync();

          })
          .finally(() => {
            opener.removeAttribute("aria-disabled");
            opener.classList.remove("loading");
            opener.querySelector(".loading__spinner").classList.add("hidden");
          });
      }

      setupQuickAddMediaSliderSync() {
        const modal = this.modalContent;
        if (!modal) return;

        const form =
          modal.querySelector('form[action^="/cart/add"] input[name="id"]') ||
          modal;
        if (!form) return;

        if (form._quickAddSyncHandler) {
          form.removeEventListener("change", form._quickAddSyncHandler);
        }

        const syncSliderToGallery = () => {

          const $gallery = $(modal).find('[id^="Slider-Gallery-quickadd"]');
          if ($gallery.length === 0) return;

          const $firstImg = $gallery.find("img").first();

            let lastFirstImgSrc = $firstImg.attr("src");
            const $slider = $(modal).find(".quickadd-media-slider");

            const syncIfChanged = () => {
            const currentFirstImg = $gallery.find("img").first();
            const currentSrc = currentFirstImg.attr("src");
            if (currentSrc !== lastFirstImgSrc) {
              lastFirstImgSrc = currentSrc;
              const galleryDataId = currentFirstImg.attr("data-id");
              const $sliderImg = $slider.find(`[data-id="${galleryDataId}"]`);
              if ($sliderImg.length && $slider.hasClass("slick-initialized")) {
              $slider.slickGoTo($sliderImg.attr("index"));
              }
              observer.disconnect();
            }
            };

            const observer = new MutationObserver(syncIfChanged);
            if ($gallery.length && $firstImg.length) {
            observer.observe($gallery.get(0), { childList: true, subtree: true, attributes: true });
            }
        };

        form.addEventListener("change", () => {
          syncSliderToGallery();
        });
        form._quickAddSyncHandler = syncSliderToGallery;
      }

      preprocessHTML(productElement) {
        productElement.classList.forEach((classApplied) => {
          if (classApplied.startsWith("color-") || classApplied === "gradient")
            this.modalContent.classList.add(classApplied);
        });
        this.preventDuplicatedIDs(productElement);
        this.removeDOMElements(productElement);
        this.removeGalleryListSemantic(productElement);
        this.updateImageSizes(productElement);
        this.preventVariantURLSwitching(productElement);
        productElement.classList.add("quick-add-productelement");

      }

      preventVariantURLSwitching(productElement) {
        productElement.setAttribute("data-update-url", "false");
      }

      removeDOMElements(productElement) {
        const pickupAvailability = productElement.querySelector(
          "pickup-availability"
        );
        if (pickupAvailability) pickupAvailability.remove();

        const productModal = productElement.querySelector("product-modal");
        if (productModal) productModal.remove();

        const modalDialog = productElement.querySelectorAll("modal-dialog");
        if (modalDialog) modalDialog.forEach((modal) => modal.remove());
      }

      preventDuplicatedIDs(productElement) {
        const sectionId = productElement.dataset.section;

        const oldId = sectionId;
        const newId = `quickadd-${sectionId}`;
        productElement.innerHTML = productElement.innerHTML.replaceAll(
          oldId,
          newId
        );
        Array.from(productElement.attributes).forEach((attribute) => {
          if (attribute.value.includes(oldId)) {
            productElement.setAttribute(
              attribute.name,
              attribute.value.replace(oldId, newId)
            );
          }
        });

        productElement.dataset.originalSection = sectionId;
      }

      removeGalleryListSemantic(productElement) {
        const galleryList = productElement.querySelector(
          '[id^="Slider-Gallery"]'
        );
        if (!galleryList) return;

        galleryList.setAttribute("role", "presentation");
        galleryList
          .querySelectorAll('[id^="Slide-"]')
          .forEach((li) => li.setAttribute("role", "presentation"));
      }

      updateImageSizes(productElement) {
        const product = productElement.querySelector(".product");
        const desktopColumns = product?.classList.contains("product--columns");
        if (!desktopColumns) return;

        const mediaImages = product.querySelectorAll(".product__media img");
        if (!mediaImages.length) return;

        let mediaImageSizes =
          "(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

        if (product.classList.contains("product--medium")) {
          mediaImageSizes = mediaImageSizes.replace("715px", "605px");
        } else if (product.classList.contains("product--small")) {
          mediaImageSizes = mediaImageSizes.replace("715px", "495px");
        }

        mediaImages.forEach((img) =>
          img.setAttribute("sizes", mediaImageSizes)
        );
      }
    }
  );
}
