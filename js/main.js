document.addEventListener('DOMContentLoaded', function() {    
    const dropdownButton = document.querySelector('.dropdown-open-button');
    const closeButton = document.querySelector('.dropdown-close-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const blurOverlay = document.createElement('div');
    blurOverlay.classList.add('blur-overlay');
    document.body.appendChild(blurOverlay);

    function handleResize() {
        if (window.innerWidth > 1200) {
            dropdownButton.style.display = 'none'; 
            closeButton.style.display = 'none'; 
        } else if (!dropdownMenu.classList.contains('active')) {
            dropdownButton.style.display = 'flex';
        }
    }

    dropdownButton.addEventListener('click', function(event) {
        event.stopPropagation();
        const isActive = dropdownMenu.classList.toggle('active'); 
        dropdownButton.style.display = 'none'; 
        closeButton.style.display = 'flex'; 
        dropdownButton.setAttribute('aria-expanded', isActive);
        if (isActive) {
            document.body.style.overflow = 'hidden'; 
            blurOverlay.classList.add('active');
        } else {
            document.body.style.overflow = '';
            blurOverlay.classList.remove('active');
        }
    });

    closeButton.addEventListener('click', function(event) {
        event.stopPropagation(); 
        dropdownMenu.classList.remove('active');
        dropdownButton.style.display = 'flex';
        closeButton.style.display = 'none'; 
        document.body.style.overflow = ''; 
        blurOverlay.classList.remove('active');
    });

    window.addEventListener('resize', handleResize);

    handleResize();
});





const menu = document.querySelector('.menu');
const header = document.querySelector('.header');

let lastScrollTop = 0;
let ticking = false;
let isHeaderAndMenuVisible = true;

function toggleMenuOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (scrollTop > lastScrollTop) {
                if (isHeaderAndMenuVisible) {
                    header.style.transform = 'translateY(-100%)';
                    menu.style.transform = 'translateY(-140%)'; 
                    isHeaderAndMenuVisible = false; 
                }
            } else {
                if (!isHeaderAndMenuVisible) {
                    header.style.transform = 'translateY(0)';
                    menu.style.transform = 'translateY(0)'; 
                    isHeaderAndMenuVisible = true;
                }
            }
            lastScrollTop = scrollTop;
            ticking = false;
        });

        ticking = true;
    }
}

window.addEventListener('scroll', toggleMenuOnScroll);

menu.style.transition = 'transform 0.3s ease'; 
header.style.transition = 'transform 0.3s ease'; 



document.addEventListener('scroll', function() {
    var elements = [
        ...document.querySelectorAll('.scrollObject'),
        ...document.querySelectorAll('.invisibleObject')
    ];

    var screenPosition = window.innerHeight / 1.2;

    elements.forEach(function(element) {
        var elementPosition = element.getBoundingClientRect().top;

        if (elementPosition < screenPosition) {
            if (element.classList.contains('scrollObject')) {
                element.classList.add('scroll'); 
            }
            if (element.classList.contains('invisibleObject')) {
                element.classList.add('invisible'); 
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.slider');

    sliders.forEach((slider, index) => {
        const btnL = slider.querySelector('.btn-left');
        const btnR = slider.querySelector('.btn-right');
        const sliderRow = slider.querySelector('.slider__slides');
        const slides = sliderRow.querySelectorAll('.slider-item, .vertical-slider-item');
        const slidesCount = slides.length;
        const thumb = slider.querySelector('.slider-thumb');
        const switchElement = slider.querySelector('.switch');

        let count = 1;
        let slidesOnWindow = 1;

        let switchWidth = switchElement.offsetWidth;
        let thumbWidth = switchWidth / slidesCount;
        let maxThumbLeft = switchWidth - thumbWidth;

        function updateButtonStates() {
            btnL.disabled = count === 1;
            btnR.disabled = count === slidesCount - slidesOnWindow + 1;

            btnL.classList.toggle('active', count > 1);
            btnR.classList.toggle('active', count < slidesCount - slidesOnWindow + 1);
        }

        function updateThumbPosition() {
            let thumbWidth = switchWidth / slidesCount;
            thumb.style.width = `${thumbWidth}px`;
            const fraction = (count - 1) / (slidesCount - slidesOnWindow);
            const newLeft = fraction * maxThumbLeft;
            thumb.style.left = `${newLeft}px`;
        }

        function updateSliderPosition() {
            const sliderStyles = getComputedStyle(sliderRow);
            const gap = parseInt(sliderStyles.gap) || 0;
            const widthSlide = slides[0].offsetWidth + gap;
            const newSlidePos = (count - 1) * widthSlide;
            sliderRow.style.transform = `translateX(-${newSlidePos}px)`;
        }

        function changeSlide(direction) {
            if (direction === 'left' && count > 1) {
                count--;
            } else if (direction === 'right' && count < slidesCount - slidesOnWindow + 1) {
                count++;
            }
            updateSliderPosition();
            updateThumbPosition();
            updateButtonStates();
            if (count === slidesCount - slidesOnWindow + 1) {
                setTimeout(() => {
                    goToSlide(1); 
                }, 20000); 
            }
           
        }

        function goToSlide(slideNumber) {
            if (slideNumber < 1 || slideNumber > slidesCount - slidesOnWindow + 1) return;
            count = slideNumber;
            updateSliderPosition();
            updateThumbPosition();
            updateButtonStates();
            if (count === slidesCount - slidesOnWindow + 1) {
                setTimeout(() => {
                    goToSlide(1); 
                }, 20000); 
            }
        }

        btnL.addEventListener('click', () => { changeSlide('left'); });
        btnR.addEventListener('click', () => { changeSlide('right'); });

        handleMobileTap(sliderRow, changeSlide);

        switchElement.addEventListener('click', (e) => {
            if (e.target === thumb) return;

            const rect = switchElement.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const fraction = clickX / switchWidth;
            const newSlide = Math.floor(fraction * slidesCount) + 1;
            goToSlide(newSlide);
        });

        let isDragging = false;
        let startX;
        let startLeft;

        thumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startLeft = parseInt(thumb.style.left) || 0;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let deltaX = e.clientX - startX;
            let newLeft = startLeft + deltaX;
            newLeft = Math.max(0, Math.min(newLeft, maxThumbLeft));
            thumb.style.left = `${newLeft}px`;

            const fraction = newLeft / maxThumbLeft;
            const totalOffset = (slidesCount - slidesOnWindow) * (slides[0].offsetWidth + parseInt(getComputedStyle(sliderRow).gap) || 0);
            sliderRow.style.transform = `translateX(-${fraction * totalOffset}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';

                const newSlide = Math.round((parseInt(thumb.style.left) / maxThumbLeft) * (slidesCount - slidesOnWindow)) + 1;
                goToSlide(newSlide);
            }
        });

        window.addEventListener('resize', () => {
            switchWidth = switchElement.offsetWidth;
            thumbWidth = thumb.offsetWidth;
            maxThumbLeft = switchWidth - thumbWidth;

            updateThumbPosition();
            updateSliderPosition();
        });

        goToSlide(count);

    });



    const sliders3 = document.querySelectorAll('.testimonials-slider'); 

    sliders3.forEach((sliderContainer) => {
        const sliderBlock = sliderContainer.querySelector(".slider__slides");
        const slides = Array.from(sliderBlock.children);
        const btnLeft = sliderContainer.querySelector(".btn-left");
        const btnRight = sliderContainer.querySelector(".btn-right");
        const thumb = sliderContainer.querySelector('.slider-thumb');
        const switchElement = sliderContainer.querySelector('.switch');
    
        const slidesCount = slides.length;
        const ConstantSlidesCount = slides.length;
        let slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(sliderBlock).gap || 0);
        let currentIndex = 1;
    
        slides.forEach((slide, index) => {
            slide.id = `slide-${index + 1}`;
            slide.classList.add('original-slide');
            const cloneLeft = slide.cloneNode(true);
            const cloneRight = slide.cloneNode(true);
            cloneLeft.id = `slide-${index + 1}`;
            cloneRight.id = `slide-${index + 1}`;
            sliderBlock.appendChild(cloneRight);
            sliderBlock.insertBefore(cloneLeft, sliderBlock.firstChild);
        });
    
        function updateSlideWidth() {
            slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(sliderBlock).gap || 0);
        }
    
        function updateThumbPosition() {
            const adjustedIndex = (currentIndex - 1) % slidesCount; 
            const fraction = adjustedIndex / (slidesCount - 1); 
            const switchWidth = switchElement.offsetWidth;
            const thumbWidth = switchWidth / slidesCount;
            thumb.style.width = `${thumbWidth}px`;
            const maxThumbLeft = switchWidth - thumbWidth;
            thumb.style.left = `${fraction * maxThumbLeft}px`;
        }
    
        function updateSlideVisibility() {
            slides.forEach((slide, index) => {
                const originalSlide = document.getElementById(`slide-${index + 1}`);
                const clonedSlides = [...document.querySelectorAll(`#slide-${index + 1}`)];
    
                let neighborIndex = currentIndex - 2;
                if (neighborIndex < 0) {
                    neighborIndex = slidesCount - 1; 
                }
    
                if (index === neighborIndex) {
                    originalSlide.style.opacity = 1;
                    clonedSlides.forEach(clone => clone.style.opacity = 1);
                } else {
                    originalSlide.style.opacity = 0.4;
                    clonedSlides.forEach(clone => clone.style.opacity = 0.4);
                }
            });
        }
    
        function updateSliderPosition() {
            sliderBlock.style.transition = "transform 0.5s ease";
            sliderBlock.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
            updateThumbPosition();
            updateSlideVisibility();
        }
    
        function resetSliderPosition() {
            sliderBlock.style.transition = "none";
            sliderBlock.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
        }
    
        function moveRight() {
            if (currentIndex >= slidesCount) {
                currentIndex = slidesCount - ConstantSlidesCount;
                resetSliderPosition();
                setTimeout(() => {
                    currentIndex++;
                    updateSliderPosition();
                }, 20);
            } else {
                currentIndex++;
                updateSliderPosition();
            }
        }
    
        function moveLeft() {
            if (currentIndex <= 1) {
                currentIndex = slidesCount + 1;
                resetSliderPosition();
                setTimeout(() => {
                    currentIndex--;
                    updateSliderPosition();
                }, 20);
            } else {
                currentIndex--;
                updateSliderPosition();
            }
        }
    
        btnRight.addEventListener("click", moveRight);
        btnLeft.addEventListener("click", moveLeft);
    
        handleMobileTap(sliderBlock, (direction) => {
            if (direction === 'left') moveLeft();
            else moveRight();
        });
    
        switchElement.addEventListener('click', (e) => {
            if (e.target === thumb) return;
    
            const rect = switchElement.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const fraction = clickX / switchElement.offsetWidth;
            const newSlide = Math.floor(fraction * slidesCount) + 1;
            currentIndex = newSlide;
            updateSliderPosition();
        });
    
        let isDragging = false;
        let startX;
        let startLeft;
    
        thumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startLeft = parseInt(thumb.style.left) || 0;
            document.body.style.userSelect = 'none';
        });
    
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let deltaX = e.clientX - startX;
            let newLeft = startLeft + deltaX;
            const switchWidth = switchElement.offsetWidth;
            const thumbWidth = thumb.offsetWidth;
            const maxThumbLeft = switchWidth - thumbWidth;
            newLeft = Math.max(0, Math.min(newLeft, maxThumbLeft));
            thumb.style.left = `${newLeft}px`;
        
            const fraction = newLeft / maxThumbLeft;
            currentIndex = Math.round(fraction * (slidesCount - 1)) + 1;
        
            const slidesOnWindow = Math.floor(switchElement.offsetWidth / slides[0].offsetWidth);
            const totalOffset = (slidesCount - slidesOnWindow) * (slides[0].offsetWidth + parseInt(getComputedStyle(sliderBlock).gap) || 0);
            sliderBlock.style.transform = `translateX(-${fraction * totalOffset}px)`;
            updateSliderPosition();
        });
        
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                updateThumbPosition();
            }
        });
    
        window.addEventListener('resize', () => {
            updateSlideWidth();
            updateSliderPosition();
            updateSlideVisibility();
        });
    
        updateSliderPosition();
        updateSlideVisibility();
    });
    
});
function handleMobileTap(sliderRow, changeSlide) {
    let x1 = null;
    let y1 = null;

    sliderRow.addEventListener('touchstart', (event) => {
        const firstTouch = event.touches[0];
        x1 = firstTouch.clientX;
        y1 = firstTouch.clientY;
    });

    sliderRow.addEventListener('touchmove', (event) => {
        if (!x1 || !y1) return;

        event.preventDefault();

        let x2 = event.touches[0].clientX;
        let y2 = event.touches[0].clientY;
        let xDif = x2 - x1;
        let yDif = y2 - y1;

        if (Math.abs(xDif) > Math.abs(yDif)) {
            if (xDif > 0) changeSlide('left');
            else changeSlide('right');
        }

        x1 = null;
        y1 = null;
    });
}
