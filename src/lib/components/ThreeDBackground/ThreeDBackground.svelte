<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import * as THREE from 'three';

	let canvasRef: HTMLCanvasElement;
	let containerRef: HTMLDivElement;
	let animationFrameId: number;

	// ThreeJS core variables
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;

	// Structural Groups (offset to the right)
	let platformsGroup: THREE.Group;
	let streamsGroup: THREE.Group;
	let particlesGroup: THREE.Group;

	// References for animation
	let platforms: Array<{
		group: THREE.Group;
		floatOffset: number;
		floatSpeed: number;
		startY: number;
	}> = [];

	let packets: Array<{
		mesh: THREE.Mesh;
		startPos: THREE.Vector3;
		endPos: THREE.Vector3;
		progress: number;
		speed: number;
	}> = [];

	let rotatingElements: Array<{
		mesh: THREE.Object3D;
		speedX: number;
		speedY: number;
		speedZ: number;
	}> = [];

	let pulsingNodes: Array<{
		mesh: THREE.Mesh;
		pulseSpeed: number;
		time: number;
		baseOpacity: number;
	}> = [];

	// Mouse parallax variables
	let targetCamera = { x: 0, y: 0, z: 9.5 };
	let currentCamera = { x: 0, y: 0, z: 9.5 };
	let lastTime = 0;

	// Reactive update on theme change — computed once per theme value change
	$: colors = $theme
		? {
				bg: 0x0a0d16,
				platform: 0x312e81,
				streamLine: 0x1e1b4b,
				packet: 0x06b6d4,
				k8sNode: 0x6366f1,
				dbServer: 0x10b981,
				ingressGateway: 0xa855f7,
				dust: 0x475569
		  }
		: {
				bg: 0xf8fafc,
				platform: 0xe2e8f0,
				streamLine: 0xcbd5e1,
				packet: 0x0284c7,
				k8sNode: 0x4f46e5,
				dbServer: 0x059669,
				ingressGateway: 0x7c3aed,
				dust: 0x94a3b8
		  };

	// NOTE: We do NOT use a $: reactive block to call updateMaterialsColors() here.
	// Doing so would fire on every $theme or colors change and cause WebGL canvas flicker.
	// Instead we use an explicit theme.subscribe() inside onMount (see below).

	function updateMaterialsColors() {
		if (!scene) return;

		// 1. Platforms
		platforms.forEach((p) => {
			p.group.traverse((child) => {
				if (child instanceof THREE.Mesh && child.name === 'platform-base') {
					const mat = child.material as THREE.MeshPhysicalMaterial;
					if (mat) {
						mat.color.setHex(colors.platform);
						mat.needsUpdate = true;
					}
				}
			});
		});

		// 2. Data Streams
		if (streamsGroup) {
			streamsGroup.traverse((child) => {
				if (child instanceof THREE.Line) {
					const mat = child.material as THREE.LineBasicMaterial;
					if (mat) {
						mat.color.setHex(colors.streamLine);
						mat.needsUpdate = true;
					}
				}
			});
		}

		// 3. Packets
		packets.forEach((p) => {
			const mat = p.mesh.material as THREE.MeshStandardMaterial;
			if (mat) {
				mat.color.setHex(colors.packet);
				mat.needsUpdate = true;
			}
		});

		// 4. Pulsing and rotating nodes
		pulsingNodes.forEach((p) => {
			const mat = p.mesh.material as THREE.MeshPhysicalMaterial;
			if (mat) {
				if (p.mesh.name === 'k8s-node') {
					mat.color.setHex(colors.k8sNode);
				} else if (p.mesh.name === 'db-server') {
					mat.color.setHex(colors.dbServer);
				} else if (p.mesh.name === 'ingress-ring') {
					mat.color.setHex(colors.ingressGateway);
				}
				mat.needsUpdate = true;
			}
		});

		// 5. Dust
		if (particlesGroup) {
			const mat = (particlesGroup.children[0] as THREE.Points)?.material as THREE.PointsMaterial;
			if (mat) {
				mat.color.setHex(colors.dust);
				mat.needsUpdate = true;
			}
		}
	}

	// Helper to draw a flat platform circle grid
	function createPlatformBase(radius: number) {
		const group = new THREE.Group();
		
		// Outer wireframe ring
		const outerGeo = new THREE.TorusGeometry(radius, 0.015, 6, 24);
		const outerMat = new THREE.MeshPhysicalMaterial({
			color: colors.platform,
			transparent: true,
			opacity: 0.25,
			roughness: 0.1,
			metalness: 0.8,
			clearcoat: 1.0,
			clearcoatRoughness: 0.1
		});
		const outerRing = new THREE.Mesh(outerGeo, outerMat);
		outerRing.rotation.x = Math.PI / 2;
		outerRing.name = 'platform-base';
		group.add(outerRing);

		// Inner radial cross-lines
		const lineMat = new THREE.LineBasicMaterial({
			color: colors.platform,
			transparent: true,
			opacity: 0.12
		});
		for (let i = 0; i < 4; i++) {
			const angle = (i / 4) * Math.PI;
			const pts = [
				new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)),
				new THREE.Vector3(-radius * Math.cos(angle), 0, -radius * Math.sin(angle))
			];
			const geo = new THREE.BufferGeometry().setFromPoints(pts);
			const line = new THREE.Line(geo, lineMat);
			group.add(line);
		}

		return group;
	}

	function createVolumetricPlatform(x: number, y: number, z: number, radius: number) {
		const group = new THREE.Group();
		group.position.set(x, y, z);

		// Flat base
		const base = createPlatformBase(radius);
		group.add(base);

		return group;
	}

	function initPlatformEcosystems() {
		// 1. Top Ingress Layer Platform (Load Balancer & API Gateway)
		const p1 = createVolumetricPlatform(4.0, 2.3, 0.0, 0.85);
		
		// Ingress Rotating Torus Loops
		const loopGeo = new THREE.TorusGeometry(0.35, 0.02, 6, 32);
		const loopMat = new THREE.MeshPhysicalMaterial({
			color: colors.ingressGateway,
			wireframe: true,
			transparent: true,
			opacity: 0.45,
			emissive: colors.ingressGateway,
			emissiveIntensity: 0.5
		});
		const loop1 = new THREE.Mesh(loopGeo, loopMat);
		loop1.rotation.y = Math.PI / 4;
		loop1.name = 'ingress-ring';
		p1.add(loop1);

		const loop2 = new THREE.Mesh(loopGeo, loopMat);
		loop2.rotation.x = Math.PI / 2.3;
		loop2.name = 'ingress-ring';
		p1.add(loop2);

		rotatingElements.push({ mesh: loop1, speedX: 0.005, speedY: 0.008, speedZ: 0.0 });
		rotatingElements.push({ mesh: loop2, speedX: 0.003, speedY: 0.0, speedZ: 0.006 });
		pulsingNodes.push({ mesh: loop1, pulseSpeed: 0.02, time: 0, baseOpacity: 0.45 });
		pulsingNodes.push({ mesh: loop2, pulseSpeed: 0.015, time: Math.PI / 2, baseOpacity: 0.45 });

		platformsGroup.add(p1);
		platforms.push({ group: p1, floatOffset: 0, floatSpeed: 0.0012, startY: 2.3 });

		// 2. Middle App Layer Platform (Kubernetes Nodes & Docker Pods)
		const p2 = createVolumetricPlatform(2.8, 0.0, -0.6, 1.1);

		// Kubernetes deployment pods (wireframe cubes with pulsing nodes)
		const k8sPos = [
			{ x: -0.4, z: -0.2 },
			{ x: 0.3, z: -0.3 },
			{ x: 0.0, z: 0.4 }
		];
		const podGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
		const nodeGeo = new THREE.SphereGeometry(0.08, 6, 6);

		k8sPos.forEach((pos, idx) => {
			const podGroup = new THREE.Group();
			podGroup.position.set(pos.x, 0.16, pos.z);

			const outerMat = new THREE.MeshPhysicalMaterial({
				color: colors.k8sNode,
				wireframe: true,
				transparent: true,
				opacity: 0.28,
				emissive: colors.k8sNode,
				emissiveIntensity: 0.2
			});
			const podMesh = new THREE.Mesh(podGeo, outerMat);
			podGroup.add(podMesh);

			const innerMat = new THREE.MeshPhysicalMaterial({
				color: colors.k8sNode,
				transparent: true,
				opacity: 0.7,
				roughness: 0.2,
				metalness: 0.5,
				emissive: colors.k8sNode,
				emissiveIntensity: 0.8
			});
			const nodeMesh = new THREE.Mesh(nodeGeo, innerMat);
			nodeMesh.name = 'k8s-node';
			podGroup.add(nodeMesh);

			p2.add(podGroup);
			rotatingElements.push({ mesh: podMesh, speedX: 0.004, speedY: 0.006, speedZ: 0.002 });
			pulsingNodes.push({ mesh: nodeMesh, pulseSpeed: 0.025, time: idx * 1.5, baseOpacity: 0.7 });
		});

		platformsGroup.add(p2);
		platforms.push({ group: p2, floatOffset: Math.PI / 3, floatSpeed: 0.0009, startY: 0.0 });

		// 3. Bottom Data Layer Platform (Stacked Volumetric Databases)
		const p3 = createVolumetricPlatform(3.8, -2.3, 0.5, 0.95);

		// Databases cylinders
		const dbPos = [
			{ x: -0.3, z: 0.0 },
			{ x: 0.3, z: 0.2 }
		];
		const dbGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 10);
		const dbMat = new THREE.MeshPhysicalMaterial({
			color: colors.dbServer,
			wireframe: true,
			transparent: true,
			opacity: 0.3,
			emissive: colors.dbServer,
			emissiveIntensity: 0.3,
			roughness: 0.1,
			metalness: 0.9
		});

		dbPos.forEach((pos, idx) => {
			const dbGroup = new THREE.Group();
			dbGroup.position.set(pos.x, 0, pos.z);

			// Stack 3 database disks
			for (let d = 0; d < 3; d++) {
				const disk = new THREE.Mesh(dbGeo, dbMat);
				disk.position.y = 0.1 + d * 0.16;
				disk.name = 'db-server';
				dbGroup.add(disk);
				
				pulsingNodes.push({
					mesh: disk,
					pulseSpeed: 0.012,
					time: idx * 2.0 + d * 0.5,
					baseOpacity: 0.3
				});
			}
			p3.add(dbGroup);
		});

		platformsGroup.add(p3);
		platforms.push({ group: p3, floatOffset: (2 * Math.PI) / 3, floatSpeed: 0.0014, startY: -2.3 });
	}

	function initDataStreams() {
		// Define paths connecting the layers (Ingress -> App Nodes -> DB)
		const streamMat = new THREE.LineBasicMaterial({
			color: colors.streamLine,
			transparent: true,
			opacity: 0.16
		});

		// We will draw connections using quadratic bezier curves for organic neon lines
		const createCurve = (start: THREE.Vector3, end: THREE.Vector3, offsetVal: number) => {
			const midX = (start.x + end.x) / 2 + offsetVal;
			const midY = (start.y + end.y) / 2;
			const midZ = (start.z + end.z) / 2;
			const control = new THREE.Vector3(midX, midY, midZ);
			
			const curve = new THREE.QuadraticBezierCurve3(start, control, end);
			const points = curve.getPoints(24);
			const geo = new THREE.BufferGeometry().setFromPoints(points);
			const line = new THREE.Line(geo, streamMat);
			streamsGroup.add(line);

			// Spawn data packets along this curve path
			const packetGeo = new THREE.SphereGeometry(0.08, 6, 6);
			const packetMat = new THREE.MeshStandardMaterial({
				color: colors.packet,
				transparent: true,
				opacity: 0.8,
				emissive: colors.packet,
				emissiveIntensity: 1.2
			});

			// 2 packets per stream running at offset offsets
			for (let p = 0; p < 2; p++) {
				const mesh = new THREE.Mesh(packetGeo, packetMat);
				scene.add(mesh);
				packets.push({
					mesh,
					startPos: start.clone(),
					endPos: end.clone(),
					progress: p * 0.5,
					speed: 0.0018 + Math.random() * 0.0015
				});
			}
		};

		// Ingress Platform (4.0, 2.3, 0.0) -> App Platform (2.8, 0.0, -0.6)
		createCurve(new THREE.Vector3(4.0, 2.0, 0.0), new THREE.Vector3(2.8, 0.2, -0.6), -0.5);

		// App Platform (2.8, 0.0, -0.6) -> DB Platform (3.8, -2.3, 0.5)
		createCurve(new THREE.Vector3(2.8, -0.2, -0.6), new THREE.Vector3(3.8, -2.1, 0.5), 0.6);

		// DB Platform (3.8, -2.3, 0.5) -> Ingress Platform (4.0, 2.3, 0.0) (Feedback/Loop back line)
		createCurve(new THREE.Vector3(3.8, -2.1, 0.5), new THREE.Vector3(4.0, 2.0, 0.0), 1.2);
	}

	function initBackgroundDust() {
		const count = 55;
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(count * 3);

		for (let i = 0; i < count; i++) {
			// Volumetric cluster offset strictly to the right half
			positions[i * 3] = 1.8 + Math.random() * 4.5;      // X
			positions[i * 3 + 1] = (Math.random() - 0.5) * 9.0; // Y
			positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0; // Z
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			color: colors.dust,
			size: 0.06,
			transparent: true,
			opacity: 0.38,
			sizeAttenuation: true
		});

		const points = new THREE.Points(geometry, material);
		particlesGroup.add(points);
	}

	function handleMouseMove(e: MouseEvent) {
		const nx = e.clientX / window.innerWidth - 0.5;
		const ny = e.clientY / window.innerHeight - 0.5;

		targetCamera.x = nx * 5.0; // Increased parallax
		targetCamera.y = -ny * 4.5;
	}

	function handleResize() {
		if (!renderer || !camera) return;
		const w = window.innerWidth;
		const h = window.innerHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}

	function animate(time: number) {
		animationFrameId = requestAnimationFrame(animate);

		if (!scene || !renderer || !camera) return;

		const delta = time - lastTime;
		lastTime = time;

		// 1. Camera Parallax shift (focus centered at origin, models shifted right)
		currentCamera.x += (targetCamera.x - currentCamera.x) * 0.045;
		currentCamera.y += (targetCamera.y - currentCamera.y) * 0.045;
		camera.position.set(currentCamera.x, currentCamera.y, currentCamera.z);
		camera.lookAt(0, 0, 0);

		// 2. Slow horizontal drift of entire ecosystem
		scene.rotation.y = Math.sin(time * 0.00008) * 0.08;

		// 3. Platform vertical floating oscillation
		platforms.forEach((p) => {
			p.floatOffset += p.floatSpeed * 10;
			p.group.position.y = p.startY + Math.sin(p.floatOffset) * 0.08;
			
			// Slow yaw rotation of platforms
			p.group.rotation.y += 0.0004;
		});

		// 4. Packet movement on curve segments (Linear Bezier interpolation)
		packets.forEach((p) => {
			p.progress += p.speed;
			if (p.progress >= 1.0) p.progress = 0;

			// Interpolate along quadratic curve
			const pct = p.progress;
			const midX = (p.startPos.x + p.endPos.x) / 2 + (p.endPos.y > p.startPos.y ? 1.2 : -0.5);
			const midY = (p.startPos.y + p.endPos.y) / 2;
			const midZ = (p.startPos.z + p.endPos.z) / 2;

			// Bezier formula
			const x = (1 - pct) * (1 - pct) * p.startPos.x + 2 * (1 - pct) * pct * midX + pct * pct * p.endPos.x;
			const y = (1 - pct) * (1 - pct) * p.startPos.y + 2 * (1 - pct) * pct * midY + pct * pct * p.endPos.y;
			const z = (1 - pct) * (1 - pct) * p.startPos.z + 2 * (1 - pct) * pct * midZ + pct * pct * p.endPos.z;

			p.mesh.position.set(x, y, z);
		});

		// 5. Rotate elements (cubes, torus rings)
		rotatingElements.forEach((re) => {
			re.mesh.rotation.x += re.speedX;
			re.mesh.rotation.y += re.speedY;
			re.mesh.rotation.z += re.speedZ;
		});

		// 6. Pulse glowing nodes (Kubernetes app components)
		pulsingNodes.forEach((pn) => {
			pn.time += pn.pulseSpeed;
			const mat = pn.mesh.material as THREE.MeshPhysicalMaterial;
			if (mat) {
				mat.opacity = pn.baseOpacity * (0.4 + Math.sin(pn.time) * 0.6);
				if (mat.emissiveIntensity !== undefined) {
					mat.emissiveIntensity = 0.2 + (Math.sin(pn.time) * 0.8);
				}
			}
		});

		// 7. Slow particle rotation
		if (particlesGroup) {
			particlesGroup.children.forEach((pts) => {
				pts.rotation.y += 0.0003;
			});
		}

		renderer.render(scene, camera);
	}

	onMount(() => {
		const w = window.innerWidth;
		const h = window.innerHeight;

		// 1. Setup Scene & Camera
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
		camera.position.set(0, 0, 9.5);

		// Add Lighting for physical materials
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		const dirLight = new THREE.DirectionalLight(0x6366f1, 2);
		dirLight.position.set(5, 5, 5);
		scene.add(dirLight);

		const pointLight1 = new THREE.PointLight(0x06b6d4, 3, 10);
		pointLight1.position.set(0, 2, 2);
		scene.add(pointLight1);

		// 2. Setup WebGL Renderer with alpha channel
		renderer = new THREE.WebGLRenderer({
			canvas: canvasRef,
			antialias: true,
			alpha: true,
			powerPreference: 'low-power'
		});
		renderer.setSize(w, h);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setClearColor(0x000000, 0); // Transparent canvas background

		// 3. Initialize structural groups
		platformsGroup = new THREE.Group();
		scene.add(platformsGroup);

		streamsGroup = new THREE.Group();
		scene.add(streamsGroup);

		particlesGroup = new THREE.Group();
		scene.add(particlesGroup);

		// Generate systems
		initPlatformEcosystems();
		initDataStreams();
		initBackgroundDust();

		// 4. Handlers
		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);

		// 5. Subscribe to theme changes to update material colors AFTER scene is ready.
		// We skip the first emission (current value) since materials are initialized
		// with the correct colors already. Only react to actual user-triggered changes.
		let firstEmit = true;
		const unsubTheme = theme.subscribe(() => {
			if (firstEmit) { firstEmit = false; return; }
			// Use requestAnimationFrame so the update happens between renders
			// and does not interrupt the active animation loop
			requestAnimationFrame(() => {
				if (scene && renderer) updateMaterialsColors();
			});
		});

		lastTime = performance.now();
		animate(lastTime);

		return () => unsubTheme();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
		}

		if (scene) {
			scene.traverse((obj) => {
				if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
					obj.geometry.dispose();
					if (Array.isArray(obj.material)) {
						obj.material.forEach((m) => m.dispose());
					} else {
						obj.material.dispose();
					}
				}
			});
		}

		if (renderer) {
			renderer.dispose();
		}
	});
</script>

<div class="threed-bg-container" bind:this={containerRef}>
	<canvas bind:this={canvasRef} class="threed-bg-canvas" />
</div>

<style lang="scss">
	.threed-bg-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
		pointer-events: none;
		overflow: hidden;
		transition: opacity 0.5s ease;
	}

	.threed-bg-canvas {
		width: 100% !important;
		height: 100% !important;
		display: block;
		opacity: 1.0;
	}

	// Adjust styling for theme brightness
	:global(.theme-dark) .threed-bg-canvas {
		opacity: 0.95;
	}

	:global(.theme-light) .threed-bg-canvas {
		opacity: 0.55;
	}
</style>
