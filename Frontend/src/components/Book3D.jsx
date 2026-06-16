import { useEffect, useRef } from "react";
import * as THREE from "three";

function Logo3D({ logoUrl, width = 380, height = 380 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5; // mai departe ca sa incapa tot cercul

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Cerc crem — mai mic ca sa nu fie taiat
    const circleGeo = new THREE.CircleGeometry(1.35, 64);
    const circleMat = new THREE.MeshBasicMaterial({
      color: 0xfdf8f5,
      side: THREE.DoubleSide,
    });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.position.z = -0.01;
    group.add(circle);

    // Logo
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      const geometry = new THREE.PlaneGeometry(2.4, 2.4);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.01,
      });

      const plane = new THREE.Mesh(geometry, material);
      group.add(plane);
    };
    img.src = logoUrl;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 2, 3);
    scene.add(dirLight);

    // Mouse drag state
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationX = 0;
    let rotationY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let floatTime = 0;

    function onMouseDown(e) {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - previousMouseX;
      const dy = e.clientY - previousMouseY;
      velocityX = dx * 0.01;
      velocityY = dy * 0.01;
      rotationY += dx * 0.01;
      rotationX += dy * 0.01;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    }

    function onMouseUp() {
      isDragging = false;
    }

    function onTouchStart(e) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
      velocityX = 0;
      velocityY = 0;
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - previousMouseX;
      const dy = e.touches[0].clientY - previousMouseY;
      velocityX = dx * 0.01;
      velocityY = dy * 0.01;
      rotationY += dx * 0.01;
      rotationX += dy * 0.01;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }

    const el = mountRef.current;
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onMouseUp);

    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      floatTime += 0.02;

      if (!isDragging) {
        velocityX *= 0.95;
        velocityY *= 0.95;
        rotationX += velocityY;
        rotationY += velocityX;

        if (Math.abs(velocityX) < 0.001 && Math.abs(velocityY) < 0.001) {
          rotationY += 0.003;
        }
      }

      group.rotation.x = rotationX;
      group.rotation.y = rotationY;
      group.position.y = Math.sin(floatTime) * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [logoUrl, width, height]);

  return (
    <div
      ref={mountRef}
      style={{
        width,
        height,
        cursor: "grab",
        userSelect: "none",
      }}
    />
  );
}

export default Logo3D;
