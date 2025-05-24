// JavaScript code will be added here later

document.addEventListener('DOMContentLoaded', () => {
    const logoPlaceholder = document.querySelector('.logo-placeholder');

    if (logoPlaceholder && typeof THREE !== 'undefined') {
        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, logoPlaceholder.clientWidth / logoPlaceholder.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(logoPlaceholder.clientWidth, logoPlaceholder.clientHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background for renderer
        logoPlaceholder.appendChild(renderer.domElement);

        // 3D Object - A Cube
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.7, roughness: 0.3 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Animation
        function animate() {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;
            cube.rotation.z += 0.003;

            renderer.render(scene, camera);
        }

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            if (logoPlaceholder.clientWidth > 0 && logoPlaceholder.clientHeight > 0) {
                camera.aspect = logoPlaceholder.clientWidth / logoPlaceholder.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(logoPlaceholder.clientWidth, logoPlaceholder.clientHeight);
            }
        });

    } else {
        if (!logoPlaceholder) console.error('Logo placeholder element not found.');
        if (typeof THREE === 'undefined') console.error('Three.js library not loaded.');
    }

    // Études de Cas Slideshow
    let slideIndex = 0;
    const slides = document.querySelectorAll('#etudes-de-cas .slide');
    const prevButton = document.querySelector('#etudes-de-cas .prev');
    const nextButton = document.querySelector('#etudes-de-cas .next');

    function showSlides(n) {
        if (!slides || slides.length === 0) return;

        // Remove 'active' class from all slides and set display to none
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none'; // Ensure it's hidden before new slide transition
        });

        slideIndex = (n + slides.length) % slides.length; // Loop through slides

        const currentSlide = slides[slideIndex];
        
        // Display the current slide then add 'active' to trigger opacity transition
        currentSlide.style.display = 'block'; 
        // Timeout to allow display property to take effect before opacity transition starts
        setTimeout(() => {
            currentSlide.classList.add('active');
        }, 20); // A small delay is usually sufficient

    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            showSlides(slideIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            showSlides(slideIndex + 1);
        });

        // Show the first slide initially
        if (slides.length > 0) {
             slides[0].style.display = 'block'; // Set initial display for the first slide
             setTimeout(() => {
                slides[0].classList.add('active');
             }, 20);
        }
    } else {
        if (slides && slides.length > 0) { // Only log error if slides exist but buttons don't
            console.error('Slideshow navigation buttons not found.');
        }
    }

    // 3D Avatars for Team Section
    // --- Section Transition Logic ---
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a'); // Updated selector
    const sections = document.querySelectorAll('#main-content-container > section');
    let currentSectionId = '';

    function updateActiveLink(targetId) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    }

    function showSection(targetId) {
        if (currentSectionId === targetId && document.querySelector(targetId)?.classList.contains('active-section')) {
            return; // Section already active
        }

        sections.forEach(section => {
            if (section.id === targetId.substring(1)) { // Remove # from targetId
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
        currentSectionId = targetId;
        updateActiveLink(targetId); // Update active link in nav

        // Update URL hash without causing a page jump, for bookmarking/history
        if (history.pushState) {
            history.pushState(null, null, targetId);
        } else {
            location.hash = targetId;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
        });
    });

    // Show initial section based on URL hash or default to #accueil
    function activateInitialSection() {
        let initialTargetId = window.location.hash;
        if (!initialTargetId || !document.querySelector(initialTargetId)) {
            initialTargetId = '#accueil'; // Default section
        }
        // Ensure the default section exists before trying to show it
        if(document.querySelector(initialTargetId)) {
            showSection(initialTargetId);
        } else if (sections.length > 0) {
            // If default #accueil is not found, show the very first section in DOM
            showSection('#' + sections[0].id);
        } else {
            // Fallback if no sections are found, ensure mainNav exists.
            if(mainNav) updateActiveLink(''); // No active link
        }
    }
    
    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        activateInitialSection();
    });

    // Navbar scroll effect
    if (mainNav) { // Check if mainNav exists
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Adjust 50 to when you want the effect to trigger
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        });
    }


    // --- Original Scripts Below ---

    const avatarPlaceholders = document.querySelectorAll('#equipe .avatar-placeholder');

    function initAvatar(placeholder, avatarConfig) {
        if (!placeholder || typeof THREE === 'undefined') {
            if (!placeholder) console.error('Avatar placeholder not found for initAvatar.');
            if (typeof THREE === 'undefined') console.error('Three.js not loaded for initAvatar.');
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, placeholder.clientWidth / placeholder.clientHeight, 0.1, 100);
        camera.position.z = 2.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(placeholder.clientWidth, placeholder.clientHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        placeholder.appendChild(renderer.domElement);

        let geometry, material, mesh;

        switch (avatarConfig.type) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 16);
                material = new THREE.MeshStandardMaterial({ color: avatarConfig.color, metalness: 0.8, roughness: 0.2 });
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
                material = new THREE.MeshStandardMaterial({ color: avatarConfig.color, metalness: 0.7, roughness: 0.3 });
                break;
            case 'icosahedron':
            default:
                geometry = new THREE.IcosahedronGeometry(1);
                material = new THREE.MeshStandardMaterial({ color: avatarConfig.color, metalness: 0.6, roughness: 0.4 });
                break;
        }

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.9);
        pointLight.position.set(2, 3, 4);
        scene.add(pointLight);

        function animate() {
            requestAnimationFrame(animate);
            mesh.rotation.x += avatarConfig.rotationSpeed.x;
            mesh.rotation.y += avatarConfig.rotationSpeed.y;
            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === placeholder) {
                    const width = placeholder.clientWidth;
                    const height = placeholder.clientHeight;
                    if (width > 0 && height > 0) {
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                    }
                }
            }
        });
        resizeObserver.observe(placeholder);
    }

    const avatarConfigs = [
        { type: 'sphere', color: 0xFFD700, rotationSpeed: { x: 0.005, y: 0.005 } }, // Gold Sphere
        { type: 'torus', color: 0xC0C0C0, rotationSpeed: { x: 0.003, y: 0.007 } }, // Silver Torus
        { type: 'icosahedron', color: 0xCD7F32, rotationSpeed: { x: 0.006, y: 0.004 } } // Bronze Icosahedron
    ];

    avatarPlaceholders.forEach((placeholder, index) => {
        if (avatarConfigs[index]) {
            initAvatar(placeholder, avatarConfigs[index]);
        } else { // Fallback if more placeholders than configs
            initAvatar(placeholder, avatarConfigs[0]); 
        }
    });

    // Activate initial section after all other scripts are set up
    activateInitialSection(); 

    // --- Scroll-based Animations Logic ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Optional: Animate only once
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

});
