document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.catalog__item');

  [...items].forEach(item => {
    const product = item.querySelector('.product');
    const buy = item.querySelector('.catalog__btn');

    buy.addEventListener('click', evt => {
      product.classList.add('product--selected');
      initHoverHandlers();
    });

    product.addEventListener('click', evt => {
      if (product.classList.contains('product--disabled')) return false;

      if (product.classList.contains('product--selected')) {
        removeHoverHandlers();

        if (product.classList.contains('product--hover')) {
          product.classList.remove('product--hover');
        }
      } else {
        initHoverHandlers();
      }

      product.classList.toggle('product--selected');
    });

    product.addEventListener('touchstart', () => {
      product.setFocusableInTouchMode(false);
    });

    const initHoverHandlers = () => {
      product.addEventListener('mouseenter', productHoverHandler);
      product.addEventListener('mouseleave', productEndHoverHandler);
    };

    const removeHoverHandlers = () => {
      product.removeEventListener('mouseenter', productHoverHandler);
      product.removeEventListener('mouseleave', productEndHoverHandler);
    };

    const productHoverHandler = () => {
      product.classList.add('product--hover');
    };
    const productEndHoverHandler = () => {
      product.classList.remove('product--hover');
    };
  });
});
