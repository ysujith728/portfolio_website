"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { AgentState, ToolInfo } from "../../types/agent";
import { AgentFallback } from "./AgentFallback";

interface AgentCanvasProps {
  state: AgentState;
  activeTool: ToolInfo | null;
  targetCoords: { x: number; y: number } | null;
  onHandScreenPosition?: (pos: { x: number; y: number }) => void;
  reducedMotion?: boolean;
}

export const AgentCanvas: React.FC<AgentCanvasProps> = ({
  state,
  activeTool,
  targetCoords,
  onHandScreenPosition,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLError, setWebGLError] = useState(false);

  // References for dynamic animation loop
  const stateRef = useRef(state);
  stateRef.current = state;
  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;
  const targetCoordsRef = useRef(targetCoords);
  targetCoordsRef.current = targetCoords;
  const onHandPosRef = useRef(onHandScreenPosition);
  onHandPosRef.current = onHandScreenPosition;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebGLError(true);
      return;
    }

    if (!renderer) {
      setWebGLError(true);
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.1, 5.0);

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- LIGHTING (High visibility & strong edge definition) ---
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 2.6);
    scene.add(ambientLight);

    // Front Key Light (Pure White for true armor color rendition)
    const frontLight = new THREE.DirectionalLight(0xffffff, 4.0);
    frontLight.position.set(1.5, 3.5, 4.5);
    scene.add(frontLight);

    // Cyan Rim Light (Highlights robot silhouette against dark background)
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 4.5);
    rimLight.position.set(0, 4, -3.5);
    scene.add(rimLight);

    // Left Fill Light (Electric Blue)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    fillLight.position.set(-3.5, 1.5, 2.5);
    scene.add(fillLight);

    // Reactor Core Point Light
    const coreLight = new THREE.PointLight(0x00f0ff, 5.0, 6);
    coreLight.position.set(0, 0.4, 0.7);
    scene.add(coreLight);

    // --- MATERIALS (Sleek Titanium White & High-Contrast Cybernetic Chrome) ---
    const metalArmor = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Pure Titanium White
      metalness: 0.45,
      roughness: 0.18,
    });

    const metalAccent = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Electric Blue
      metalness: 0.7,
      roughness: 0.25,
    });

    const metalDark = new THREE.MeshStandardMaterial({
      color: 0x334155, // Polished High-Tech Steel (Slate 700)
      metalness: 0.8,
      roughness: 0.25,
    });

    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Brushed Platinum (Slate 400)
      metalness: 0.85,
      roughness: 0.2,
    });

    // Dynamic accent materials (will lerp with target tool color)
    const currentAccentColor = new THREE.Color(0x00f0ff);
    const targetAccentColor = new THREE.Color(0x00f0ff);

    const cyanEmissive = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 4.5,
      roughness: 0.05,
    });

    const toolGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.5,
      wireframe: true,
    });

    // --- ROBOT HIERARCHY ---
    const robotRoot = new THREE.Group();
    robotRoot.position.set(0, -0.2, 0);
    scene.add(robotRoot);

    // 1. Pedestal / Holographic rings
    const ringGroup = new THREE.Group();
    const ringGeo1 = new THREE.RingGeometry(1.2, 1.25, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -1.0;
    ringGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(0.8, 0.83, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.98;
    ringGroup.add(ring2);

    robotRoot.add(ringGroup);

    // 2. Chassis / Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.32, 0.22, 0.35, 8);
    const pelvis = new THREE.Mesh(pelvisGeo, metalArmor);
    pelvis.position.y = -0.4;
    robotRoot.add(pelvis);

    // Pelvis Accent Trim
    const pelvisTrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.33, 0.33, 0.06, 8),
      metalAccent
    );
    pelvisTrim.position.y = -0.32;
    robotRoot.add(pelvisTrim);

    // 3. Spine / Vertebrae
    const spineGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18 - i * 0.02, 0.2 - i * 0.02, 0.08, 12),
        jointMaterial
      );
      disc.position.y = -0.2 + i * 0.12;
      spineGroup.add(disc);
    }
    robotRoot.add(spineGroup);

    // 4. Torso
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.25, 0);
    robotRoot.add(torsoGroup);

    // Main Titanium Chest Armor
    const chestGeo = new THREE.BoxGeometry(0.92, 0.82, 0.52);
    const chest = new THREE.Mesh(chestGeo, metalArmor);
    torsoGroup.add(chest);

    // Glowing Cyan Chest Accent Bars (High visibility stripes)
    const chestStripeL = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.45, 0.04),
      cyanEmissive
    );
    chestStripeL.position.set(-0.32, 0.12, 0.27);
    torsoGroup.add(chestStripeL);

    const chestStripeR = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.45, 0.04),
      cyanEmissive
    );
    chestStripeR.position.set(0.32, 0.12, 0.27);
    torsoGroup.add(chestStripeR);

    // Chest Reactor Core
    const coreCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16),
      metalAccent
    );
    coreCylinder.rotation.x = Math.PI / 2;
    coreCylinder.position.set(0, 0.1, 0.26);
    torsoGroup.add(coreCylinder);

    const coreCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.13, 1),
      cyanEmissive
    );
    coreCrystal.position.set(0, 0.1, 0.32);
    torsoGroup.add(coreCrystal);

    // 5. Neck & Head
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.15, 0.2, 12),
      jointMaterial
    );
    neck.position.set(0, 0.5, 0);
    torsoGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.74, 0);
    torsoGroup.add(headGroup);

    // Helmet (Titanium White)
    const helmetGeo = new THREE.BoxGeometry(0.54, 0.48, 0.54);
    const helmet = new THREE.Mesh(helmetGeo, metalArmor);
    headGroup.add(helmet);

    // Helmet Crest (Electric Blue)
    const crestGeo = new THREE.BoxGeometry(0.12, 0.12, 0.48);
    const crest = new THREE.Mesh(crestGeo, metalAccent);
    crest.position.set(0, 0.27, 0);
    headGroup.add(crest);

    // Visor (Luminous Neon Cyan Visor with Beveled Glow)
    const visorGeo = new THREE.BoxGeometry(0.46, 0.16, 0.12);
    const visor = new THREE.Mesh(visorGeo, visorMaterial);
    visor.position.set(0, 0.03, 0.27);
    headGroup.add(visor);

    // Antenna
    const antPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.32, 8),
      metalAccent
    );
    antPole.position.set(0.25, 0.28, -0.1);
    antPole.rotation.z = -0.2;
    headGroup.add(antPole);

    const antTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      cyanEmissive
    );
    antTip.position.set(0.27, 0.42, -0.1);
    headGroup.add(antTip);

    // 6. Left Arm (Stabilizing / Rest)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.55, 0.28, 0);
    torsoGroup.add(leftArmGroup);

    const leftShoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      metalArmor
    );
    leftArmGroup.add(leftShoulder);

    // Left Shoulder Glowing Trim Ring
    const leftPauldronTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.02, 8, 24),
      cyanEmissive
    );
    leftPauldronTrim.rotation.x = Math.PI / 2;
    leftArmGroup.add(leftPauldronTrim);

    const leftUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.09, 0.5, 8),
      jointMaterial
    );
    leftUpperArm.position.set(-0.08, -0.3, 0);
    leftUpperArm.rotation.z = -0.1;
    leftArmGroup.add(leftUpperArm);

    // Left Forearm (Titanium White with Accent)
    const leftForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.5, 8),
      metalArmor
    );
    leftForearm.position.set(-0.1, -0.75, 0.1);
    leftForearm.rotation.x = 0.2;
    leftArmGroup.add(leftForearm);

    const leftWristBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.08, 8),
      metalAccent
    );
    leftWristBand.position.set(-0.1, -0.92, 0.14);
    leftWristBand.rotation.x = 0.2;
    leftArmGroup.add(leftWristBand);

    // 7. Right Arm (Aiming & Throwing Hero Mechanism)
    const rightShoulderPivot = new THREE.Group();
    rightShoulderPivot.position.set(0.55, 0.28, 0);
    torsoGroup.add(rightShoulderPivot);

    const rightShoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      metalArmor
    );
    rightShoulderPivot.add(rightShoulder);

    // Right Shoulder Glowing Trim Ring
    const rightPauldronTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.02, 8, 24),
      cyanEmissive
    );
    rightPauldronTrim.rotation.x = Math.PI / 2;
    rightShoulderPivot.add(rightPauldronTrim);

    const rightUpperArmGroup = new THREE.Group();
    rightShoulderPivot.add(rightUpperArmGroup);

    const rightUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.09, 0.5, 8),
      jointMaterial
    );
    rightUpperArm.position.set(0.08, -0.3, 0);
    rightUpperArmGroup.add(rightUpperArm);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0.08, -0.55, 0);
    rightUpperArmGroup.add(rightForearmGroup);

    // Right Forearm (Titanium White with Accent)
    const rightForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.5, 8),
      metalArmor
    );
    rightForearm.position.set(0, -0.22, 0);
    rightForearmGroup.add(rightForearm);

    const rightWristBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.08, 8),
      metalAccent
    );
    rightWristBand.position.set(0, -0.4, 0);
    rightForearmGroup.add(rightWristBand);

    // Right Hand & Holographic Tool Socket
    const rightHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.13, 0.15),
      metalArmor
    );
    rightHand.position.set(0, -0.48, 0);
    rightForearmGroup.add(rightHand);

    // Tool Emitter Hologram inside Hand
    const toolHoloMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      toolGlowMaterial
    );
    toolHoloMesh.position.set(0, -0.55, 0.15);
    toolHoloMesh.visible = false;
    rightForearmGroup.add(toolHoloMesh);

    // Cursor tracking vector
    const mouseVector = new THREE.Vector2(0, 0);
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // --- INTERACTIVE 3D DRAG ORBIT ---
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let orbitTargetY = 0;
    let orbitTargetX = 0;
    let orbitCurrentY = 0;
    let orbitCurrentX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      orbitTargetY += deltaX * 0.008;
      orbitTargetX += deltaY * 0.006;

      // Clamp rotation angles so robot stays upright
      orbitTargetY = THREE.MathUtils.clamp(orbitTargetY, -1.2, 1.2);
      orbitTargetX = THREE.MathUtils.clamp(orbitTargetX, -0.35, 0.35);
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let throwAnimationProgress = 0;
    let gestureTimer = 0;

    const handWorldPos = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentState = stateRef.current;
      const curTool = activeToolRef.current;

      // --- DYNAMIC ACCENT COLOR SYNCING ---
      if (curTool && curTool.color) {
        targetAccentColor.set(curTool.color);
      } else {
        targetAccentColor.set(0x00f0ff);
      }
      currentAccentColor.lerp(targetAccentColor, 0.08);

      // Apply synced color across neon emitters
      cyanEmissive.color.copy(currentAccentColor);
      cyanEmissive.emissive.copy(currentAccentColor);
      visorMaterial.color.copy(currentAccentColor);
      visorMaterial.emissive.copy(currentAccentColor);
      ringMat1.color.copy(currentAccentColor);
      coreLight.color.copy(currentAccentColor);
      rimLight.color.copy(currentAccentColor);

      // Update tool glow material color if active
      if (curTool) {
        toolGlowMaterial.color.copy(currentAccentColor);
        toolGlowMaterial.emissive.copy(currentAccentColor);
      }

      // --- ORBIT SPRING & DAMPING ---
      if (!isDragging) {
        // Smoothly spring return to default center
        orbitTargetY = THREE.MathUtils.lerp(orbitTargetY, 0, 0.04);
        orbitTargetX = THREE.MathUtils.lerp(orbitTargetX, 0, 0.04);
      }
      orbitCurrentY = THREE.MathUtils.lerp(orbitCurrentY, orbitTargetY, 0.15);
      orbitCurrentX = THREE.MathUtils.lerp(orbitCurrentX, orbitTargetX, 0.15);

      robotRoot.rotation.y = orbitCurrentY;
      robotRoot.rotation.x = orbitCurrentX;

      // Rotate pedestal rings
      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.z = -elapsedTime * 0.7;

      // Pulse reactor core
      const corePulse = 2.0 + Math.sin(elapsedTime * 4) * 0.9;
      cyanEmissive.emissiveIntensity = corePulse;
      coreCrystal.rotation.y = elapsedTime * 1.5;
      coreCrystal.rotation.z = elapsedTime * 0.8;

      // Breathing motion
      const breath = Math.sin(elapsedTime * 1.5) * 0.03;
      torsoGroup.position.y = 0.25 + breath;
      headGroup.position.y = 0.72 + breath * 0.5;

      // --- STATE & KINEMATICS MACHINE ---
      if (currentState === "IDLE" || currentState === "SCANNING") {
        throwAnimationProgress = 0;
        gestureTimer = 0;
        toolHoloMesh.visible = false;

        // Subtle head tracking
        const targetHeadY = mouseVector.x * 0.35;
        const targetHeadX = -mouseVector.y * 0.25;
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadY, 0.05);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadX, 0.05);

        // Relaxed right arm
        rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, 0.1, 0.08);
        rightShoulderPivot.rotation.y = THREE.MathUtils.lerp(rightShoulderPivot.rotation.y, 0, 0.08);
        rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(rightShoulderPivot.rotation.z, -0.15, 0.08);
        rightForearmGroup.rotation.x = THREE.MathUtils.lerp(rightForearmGroup.rotation.x, 0.2, 0.08);
        rightHand.rotation.x = THREE.MathUtils.lerp(rightHand.rotation.x, 0, 0.1);
      } else if (
        currentState === "HOVER_TARGET" ||
        currentState === "TARGET_LOCK" ||
        currentState === "TOOL_SELECT" ||
        currentState === "TOOL_EQUIP"
      ) {
        // Prepare to aim / equip tool
        toolHoloMesh.visible = true;
        toolHoloMesh.rotation.x += 0.05;
        toolHoloMesh.rotation.y += 0.08;

        // Turn head toward target
        const tCoords = targetCoordsRef.current;
        let aimAngleY = 0.4;
        let aimAngleX = 0;
        if (tCoords && container) {
          const rect = container.getBoundingClientRect();
          const targetNormX = (tCoords.x - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
          const targetNormY = -(tCoords.y - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
          aimAngleY = targetNormX * 0.7;
          aimAngleX = -targetNormY * 0.4;
        }

        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, aimAngleY, 0.12);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, aimAngleX, 0.12);

        // Raise arm to charge / equip
        rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, -0.6, 0.1);
        rightShoulderPivot.rotation.y = THREE.MathUtils.lerp(rightShoulderPivot.rotation.y, aimAngleY * 0.5, 0.1);
        rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(rightShoulderPivot.rotation.z, 0.3, 0.1);
        rightForearmGroup.rotation.x = THREE.MathUtils.lerp(rightForearmGroup.rotation.x, -0.8, 0.1);
      } else if (currentState === "AIM") {
        toolHoloMesh.visible = true;
        toolHoloMesh.rotation.x += 0.1;
        toolHoloMesh.rotation.y += 0.12;

        const tCoords = targetCoordsRef.current;
        let aimAngleY = 0.5;
        let aimAngleX = -0.2;
        if (tCoords && container) {
          const rect = container.getBoundingClientRect();
          const targetNormX = (tCoords.x - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
          const targetNormY = -(tCoords.y - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
          aimAngleY = targetNormX * 0.9;
          aimAngleX = -targetNormY * 0.6;
        }

        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, aimAngleY, 0.15);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, aimAngleX, 0.15);

        // Aim arm forward and angled towards destination
        rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, -1.2 + aimAngleX * 0.4, 0.15);
        rightShoulderPivot.rotation.y = THREE.MathUtils.lerp(rightShoulderPivot.rotation.y, aimAngleY * 0.8, 0.15);
        rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(rightShoulderPivot.rotation.z, 0.2, 0.15);
        rightForearmGroup.rotation.x = THREE.MathUtils.lerp(rightForearmGroup.rotation.x, -0.3, 0.15);
      } else if (currentState === "THROW") {
        throwAnimationProgress += 0.12;
        // Powerful whip/throw forward
        if (throwAnimationProgress < 0.3) {
          // Cock back
          rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, -0.3, 0.3);
          rightForearmGroup.rotation.x = THREE.MathUtils.lerp(rightForearmGroup.rotation.x, -1.2, 0.3);
        } else {
          // Snap forward!
          rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, -1.6, 0.4);
          rightForearmGroup.rotation.x = THREE.MathUtils.lerp(rightForearmGroup.rotation.x, 0.1, 0.4);
          toolHoloMesh.visible = false; // Tool leaves the hand!
        }
      } else if (currentState === "TOOL_TRAVEL" || currentState === "TARGET_RECEIVE" || currentState === "SUCCESS") {
        toolHoloMesh.visible = false;
        // Arm follow-through then start returning
        rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, -0.2, 0.05);
        rightShoulderPivot.rotation.y = THREE.MathUtils.lerp(rightShoulderPivot.rotation.y, 0, 0.05);
        rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(rightShoulderPivot.rotation.z, -0.1, 0.05);
        rightForearmGroup.rotation.x = THREE.MathUtils.lerp(rightForearmGroup.rotation.x, 0.2, 0.05);
      } else if (currentState === "RETURN_IDLE") {
        toolHoloMesh.visible = false;
        gestureTimer += 0.06;

        // Tactical nod confirmation
        const nodTarget = gestureTimer < 0.8 ? Math.sin(gestureTimer * Math.PI) * 0.2 : 0;
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, nodTarget, 0.15);
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0, 0.08);

        // Tactile wrist flick
        const flickTarget = gestureTimer < 0.6 ? -Math.sin(gestureTimer * Math.PI * 1.5) * 0.3 : 0;
        rightHand.rotation.x = THREE.MathUtils.lerp(rightHand.rotation.x, flickTarget, 0.2);

        rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, 0.1, 0.08);
        rightShoulderPivot.rotation.y = THREE.MathUtils.lerp(rightShoulderPivot.rotation.y, 0, 0.08);
        rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(rightShoulderPivot.rotation.z, -0.15, 0.08);
      }

      // Compute hand position in screen coordinates and notify parent
      rightHand.getWorldPosition(handWorldPos);
      handWorldPos.project(camera);

      if (onHandPosRef.current && container) {
        const rect = container.getBoundingClientRect();
        const screenX = rect.left + ((handWorldPos.x + 1) * rect.width) / 2;
        const screenY = rect.top + ((-handWorldPos.y + 1) * rect.height) / 2;
        onHandPosRef.current({ x: screenX, y: screenY });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      // Dispose Three.js objects cleanly
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (webGLError || reducedMotion) {
    return (
      <AgentFallback
        state={state}
        activeTool={activeTool}
        targetLabel={activeTool ? activeTool.name : null}
        reducedMotion={reducedMotion}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] md:min-h-[480px] flex items-center justify-center select-none pointer-events-auto cursor-grab active:cursor-grabbing group"
      title="Click and drag to rotate robot in 3D space"
    >
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />
      {/* Subtle interaction cue on hover */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cyan-400/50 group-hover:text-cyan-400 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/20 backdrop-blur-sm pointer-events-none transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>3D ORBIT ACTIVE • DRAG TO ROTATE</span>
      </div>
    </div>
  );
};
