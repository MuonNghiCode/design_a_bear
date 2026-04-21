"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

interface Props {
  furColor: string;
  themeColor?: string;
  themeId?: string;
  activeAccessories?: string[];
}

export default function BearModel3D({
  furColor,
  themeColor,
  themeId,
  activeAccessories = [],
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    /* ── Scene + Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 1.2, 8);
    camera.lookAt(0, 1.2, 0);

    /* ── Lights ── */
    const ambient = new THREE.AmbientLight(0xffeedd, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(512, 512);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.35);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.25);
    rimLight.position.set(0, -2, -6);
    scene.add(rimLight);

    /* ── Materials ── */
    const fur = new THREE.MeshPhongMaterial({
      color: new THREE.Color(furColor || "#F5E6C8"),
      shininess: 18,
      specular: new THREE.Color("#ffffff"),
    });

    const innerEarColor = lightenHex(furColor || "#F5E6C8", 40);
    const innerEar = new THREE.MeshPhongMaterial({
      color: new THREE.Color(innerEarColor),
      shininess: 5,
    });

    const eyeMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#1A1A2E"),
      shininess: 120,
      specular: new THREE.Color("#6688ff"),
    });

    const eyeShine = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#ffffff"),
      shininess: 200,
    });

    const noseMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#2D1B0E"),
      shininess: 60,
    });

    const mouthMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(themeColor || "#17409A"),
      shininess: 30,
    });

    const tummyMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(innerEarColor),
      shininess: 8,
    });

    /* ── Bear group ── */
    const bear = new THREE.Group();
    scene.add(bear);

    const sphere = (r: number, mat: THREE.Material) =>
      new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), mat);

    /* Body */
    const body = sphere(1.15, fur);
    body.scale.set(1, 1.18, 0.95);
    body.position.set(0, 0, 0);
    body.castShadow = true;
    bear.add(body);

    /* Tummy patch */
    const tummy = sphere(0.68, tummyMat);
    tummy.scale.set(1, 1.1, 0.4);
    tummy.position.set(0, 0.1, 1.0);
    bear.add(tummy);

    /* Head */
    const head = sphere(0.92, fur);
    head.position.set(0, 1.85, 0);
    head.castShadow = true;
    bear.add(head);

    /* Ears */
    const earL = sphere(0.33, fur);
    earL.position.set(-0.7, 2.65, 0);
    bear.add(earL);
    const earR = sphere(0.33, fur);
    earR.position.set(0.7, 2.65, 0);
    bear.add(earR);

    /* Inner ears */
    const iEarL = sphere(0.2, innerEar);
    iEarL.scale.set(1, 1, 0.5);
    iEarL.position.set(-0.7, 2.65, 0.22);
    bear.add(iEarL);
    const iEarR = sphere(0.2, innerEar);
    iEarR.scale.set(1, 1, 0.5);
    iEarR.position.set(0.7, 2.65, 0.22);
    bear.add(iEarR);

    /* Snout */
    const snout = sphere(0.34, innerEar);
    snout.scale.set(1, 0.72, 0.8);
    snout.position.set(0, 1.72, 0.82);
    bear.add(snout);

    /* Nose */
    const nose = sphere(0.12, noseMat);
    nose.scale.set(1.2, 0.8, 0.8);
    nose.position.set(0, 1.82, 1.12);
    bear.add(nose);

    /* Eyes */
    const eyeL = sphere(0.1, eyeMat);
    eyeL.position.set(-0.3, 2.0, 0.84);
    bear.add(eyeL);
    const eyeR = sphere(0.1, eyeMat);
    eyeR.position.set(0.3, 2.0, 0.84);
    bear.add(eyeR);

    /* Eye shines */
    const shineL = sphere(0.035, eyeShine);
    shineL.position.set(-0.27, 2.06, 0.93);
    bear.add(shineL);
    const shineR = sphere(0.035, eyeShine);
    shineR.position.set(0.33, 2.06, 0.93);
    bear.add(shineR);

    /* Arms */
    const armL = sphere(0.45, fur);
    armL.scale.set(0.65, 1.3, 0.7);
    armL.position.set(-1.4, 0.3, 0.2);
    armL.rotation.z = 0.5;
    bear.add(armL);
    const armR = sphere(0.45, fur);
    armR.scale.set(0.65, 1.3, 0.7);
    armR.position.set(1.4, 0.3, 0.2);
    armR.rotation.z = -0.5;
    bear.add(armR);

    /* Legs */
    const legL = sphere(0.45, fur);
    legL.scale.set(0.75, 1.2, 0.8);
    legL.position.set(-0.6, -1.2, 0.15);
    bear.add(legL);
    const legR = sphere(0.45, fur);
    legR.scale.set(0.75, 1.2, 0.8);
    legR.position.set(0.6, -1.2, 0.15);
    bear.add(legR);

    /* Paws */
    const pawL = sphere(0.32, fur);
    pawL.scale.set(1.1, 0.65, 1.0);
    pawL.position.set(-0.68, -1.85, 0.3);
    bear.add(pawL);
    const pawR = sphere(0.32, fur);
    pawR.scale.set(1.1, 0.65, 1.0);
    pawR.position.set(0.68, -1.85, 0.3);
    bear.add(pawR);

    /* Personalization Accessories */
    if (activeAccessories.length > 0) {
      addPersonalizationAccessories(bear, activeAccessories, furColor);
    }

    /* Theme accessory */
    if (themeId && themeColor) {
      addThemeAccessory(bear, themeId, themeColor);
    }

    /* Shadow plane */
    const shadowGeo = new THREE.CircleGeometry(1.4, 48);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#0E2A66"),
      transparent: true,
      opacity: 0.08,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -2.15, 0);
    scene.add(shadow);

    /* ── Interaction: drag to rotate ── */
    let isDragging = false;
    let prevX = 0;
    let autoRotateY = 0.004;
    let targetRotY = bear.rotation.y;
    let currentRotY = bear.rotation.y;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      prevX = e.touches[0].clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      targetRotY += dx * 0.012;
      prevX = e.clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - prevX;
      targetRotY += dx * 0.012;
      prevX = e.touches[0].clientX;
    };
    const onUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", onMouseDown);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    /* ── Resize ── */
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── Animation loop ── */
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!isDragging) targetRotY += autoRotateY;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      bear.rotation.y = currentRotY;
      /* gentle bob */
      bear.position.y = Math.sin(Date.now() * 0.001) * 0.06;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeEventListener("mousedown", onMouseDown);
      mount.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [furColor, themeColor, themeId, activeAccessories]);

  return (
    <div
      ref={mountRef}
      className="w-full aspect-square rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ backgroundColor: "#EEF3FF" }}
      title="Kéo để xoay"
    />
  );
}

/* ── Personalization Accessories ── */
function addPersonalizationAccessories(
  bear: THREE.Group,
  accessoryIds: string[],
  furColor: string,
) {
  accessoryIds.forEach((id) => {
    switch (id) {
      case "bow": {
        const bowColor = "#E11D48"; // Red
        const mat = new THREE.MeshPhongMaterial({ color: bowColor });
        const bowGroup = new THREE.Group();

        const knot = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          mat,
        );
        bowGroup.add(knot);

        const wingL = new THREE.Mesh(
          new THREE.ConeGeometry(0.18, 0.35, 16),
          mat,
        );
        wingL.rotation.z = Math.PI / 2;
        wingL.position.set(-0.2, 0, 0);
        bowGroup.add(wingL);

        const wingR = new THREE.Mesh(
          new THREE.ConeGeometry(0.18, 0.35, 16),
          mat,
        );
        wingR.rotation.z = -Math.PI / 2;
        wingR.position.set(0.2, 0, 0);
        bowGroup.add(wingR);

        bowGroup.position.set(0, 0.95, 0.95);
        bowGroup.rotation.x = -0.2;
        bear.add(bowGroup);
        break;
      }
      case "glasses": {
        const glassColor = "#1F2937"; // Dark gray/Black
        const mat = new THREE.MeshPhongMaterial({ color: glassColor });

        const glassL = new THREE.Mesh(
          new THREE.TorusGeometry(0.2, 0.03, 12, 32),
          mat,
        );
        glassL.position.set(-0.3, 2.04, 0.9);
        glassL.rotation.x = Math.PI / 2 - 0.3;
        bear.add(glassL);

        const glassR = new THREE.Mesh(
          new THREE.TorusGeometry(0.2, 0.03, 12, 32),
          mat,
        );
        glassR.position.set(0.3, 2.04, 0.9);
        glassR.rotation.x = Math.PI / 2 - 0.3;
        bear.add(glassR);

        const bridge = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8),
          mat,
        );
        bridge.rotation.z = Math.PI / 2;
        bridge.position.set(0, 2.04, 0.88);
        bear.add(bridge);
        break;
      }
      case "cat_ears": {
        const outerMat = new THREE.MeshPhongMaterial({ color: furColor });
        const innerMat = new THREE.MeshPhongMaterial({ color: "#FF6B9D" }); // Pink inner ear

        const leftEar = new THREE.Group();
        const baseL = new THREE.Mesh(
          new THREE.ConeGeometry(0.25, 0.45, 4),
          outerMat,
        );
        baseL.rotation.y = Math.PI / 4;
        leftEar.add(baseL);
        const insideL = new THREE.Mesh(
          new THREE.ConeGeometry(0.15, 0.3, 4),
          innerMat,
        );
        insideL.rotation.y = Math.PI / 4;
        insideL.position.set(0, -0.05, 0.08);
        leftEar.add(insideL);
        leftEar.position.set(-0.6, 2.85, 0);
        leftEar.rotation.z = 0.2;
        bear.add(leftEar);

        const rightEar = leftEar.clone();
        rightEar.position.set(0.6, 2.85, 0);
        rightEar.rotation.z = -0.2;
        bear.add(rightEar);
        break;
      }
      case "wool_hat": {
        const hatColor = "#1D4ED8"; // Blue
        const mat = new THREE.MeshPhongMaterial({ color: hatColor });
        const mat2 = new THREE.MeshPhongMaterial({ color: "#ffffff" }); // White pom-pom

        const hatBase = new THREE.Mesh(
          new THREE.SphereGeometry(
            0.88,
            32,
            32,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2,
          ),
          mat,
        );
        hatBase.position.set(0, 2.1, 0);
        hatBase.scale.set(1, 0.8, 1);
        bear.add(hatBase);

        const pomPom = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 16, 16),
          mat2,
        );
        pomPom.position.set(0, 3.0, 0);
        bear.add(pomPom);
        break;
      }
    }
  });
}

/* ── Theme accessories ── */
function addThemeAccessory(bear: THREE.Group, themeId: string, color: string) {
  const mat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    shininess: 60,
  });
  const mat2 = new THREE.MeshPhongMaterial({
    color: new THREE.Color(lightenHex(color, 60)),
    shininess: 30,
  });

  switch (themeId) {
    case "astronaut": {
      /* Helmet visor ring */
      const visorGeo = new THREE.TorusGeometry(0.9, 0.07, 16, 64);
      const visor = new THREE.Mesh(visorGeo, mat);
      visor.position.set(0, 1.85, 0);
      visor.rotation.x = Math.PI / 2;
      bear.add(visor);
      /* Antenna */
      const ant = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.6, 12),
        mat,
      );
      ant.position.set(0, 3.35, 0);
      bear.add(ant);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), mat2);
      tip.position.set(0, 3.7, 0);
      bear.add(tip);
      break;
    }
    case "forest": {
      /* Leaf crown */
      for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 12, 12),
          mat,
        );
        const angle = (i / 5) * Math.PI * 2;
        leaf.position.set(Math.cos(angle) * 0.6, 3.0, Math.sin(angle) * 0.4);
        leaf.scale.set(0.6, 1.4, 0.5);
        bear.add(leaf);
      }
      break;
    }
    case "chef": {
      /* Chef hat */
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(1.0, 1.0, 0.08, 32),
        mat,
      );
      brim.position.set(0, 2.9, 0);
      bear.add(brim);
      const crown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.72, 0.8, 32),
        mat2,
      );
      crown.position.set(0, 3.35, 0);
      bear.add(crown);
      break;
    }
    case "music": {
      /* Small note shapes */
      const note = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), mat);
      note.position.set(1.0, 2.5, 0.5);
      bear.add(note);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8),
        mat,
      );
      stem.position.set(1.14, 2.75, 0.5);
      bear.add(stem);
      break;
    }
    case "scientist": {
      /* Glasses */
      const glassL = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.03, 12, 32),
        mat,
      );
      glassL.position.set(-0.3, 2.04, 0.9);
      glassL.rotation.x = Math.PI / 2 - 0.3;
      bear.add(glassL);
      const glassR = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.03, 12, 32),
        mat,
      );
      glassR.position.set(0.3, 2.04, 0.9);
      glassR.rotation.x = Math.PI / 2 - 0.3;
      bear.add(glassR);
      const bridge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8),
        mat,
      );
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, 2.04, 0.88);
      bear.add(bridge);
      break;
    }
    case "athlete": {
      /* Headband */
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.88, 0.08, 12, 64),
        mat,
      );
      band.position.set(0, 2.1, 0);
      band.rotation.x = 0.3;
      bear.add(band);
      break;
    }
  }
}

/* ── Lighten hex color slightly ── */
function lightenHex(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (n >> 16) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}
