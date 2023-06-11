import Image from "next/image";
import { Inter } from "next/font/google";
import Link from 'next/link';
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useRef } from "react";
import css from "styled-jsx/css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a geometry (a sphere in this case)
    const geometry = new THREE.SphereGeometry(3, 64, 64);

    // Create a material with a specific color
    const material = new THREE.MeshStandardMaterial({
      color: "#00ff83",
      roughness: 0.5
    });

    // Create a mesh by combining the geometry and material
    const mesh = new THREE.Mesh(geometry, material);

    // Add the mesh to the scene
    scene.add(mesh);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 9, 9);
    light.intensity = 1.25
    scene.add(light);
    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 15;
    scene.add(camera);

    // Create a renderer and set its size
    const webGL = document.querySelector(".webGL");
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(2);

    // Render the scene with the camera
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, webGL);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 7;

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    });

    const loop = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(loop);
    };
    loop();

    const tl = gsap.timeline({ defaults: { duration: 1 } });
    tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
    tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
    tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

    let mouseDown = false;
    let rgb = [];
    
    window.addEventListener("mousedown", () => (mouseDown = true));
    window.addEventListener("mouseup", () => (mouseDown = false));
    window.addEventListener("mousemove", (e) => {
      if (mouseDown) {
        rgb = [
          Math.round((e.pageX / sizes.width) * 255),
          Math.round((e.pageY / sizes.height) * 255),
          150,
        ];
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
      }
    });

    
    
    
    
  }, []);

  return (
    <>
      <canvas className="webGL" ref={canvasRef}></canvas>;
      <nav>
        <Link to="/">Sphere</Link>
        <ul>
          <li>Explore</li>
          <li>Create</li>
        </ul>
      </nav>
      <h1 className="title">Give it a spin</h1>
    </>
  );
}
