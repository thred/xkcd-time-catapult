/**
 * Copyright 2013 Manfred Hantschel
 * 
 * This file is part of xkcd Time Catapult.
 * 
 * xkcd Time Catapult is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * xkcd Time Catapult is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with xkcd Time Catapult. If not, see <http://www.gnu.org/licenses/>.
 */

define("Global", ["Vector", "Button"], function(Vector, Button) {
	return {
		WIDTH: 800,
		HEIGHT: 390,

		MAX_PARTICLES: 2048,
		PARTICLE_RADIUS: 3, // the image is 6x6
		DRAW_PROJECTIONS: false,
		DRAW_MOVEMENT: false,

		G: 667.384,
		N: 98.0665,
		AIR_FRICTION: 0.25,
		ABSORBSION: 0.02,
		BOUNCYNESS: 0.80,
		STICKYNESS: 0.50,
		FRICTION: 1,
		THRESHOLD: 0.50,
		PARTICLE_DIE_MASS: 0.5,

		XKCD_IMAGES: [{
			src: "asset/a228595caf108b46e53f4fe276ebac8fa1545928b650742b0812298d5dfde441.png"
		}, {
			src: "asset/c918850ed18afe2c3f3acbeef9c799aba5b10a8efeb45a2f026565383f0a72bc.png"
		}, {
			src: "asset/05457c91f50c216f6071ae194b4d1822770e1792b0c73eb0fba3cbbdeb616ec2.png"
		}, {
			src: "asset/dcbe928012a06ae5118d4cd3850a4f1bcc0a7e4e86b2c04751fe79370cbb35bc.png"
		}, {
			src: "asset/9996f99ec0e08c63b8f50c9900c73ba37417fdeef2a17888748cc0c078370b82.png"
		}, {
			src: "asset/37eba4d7ce0239d5d8b8aac659f464569debe088399ec70f6ac54036a82640a5.png"
		}, {
			src: "asset/8beeb30463e7b617e56403c7d7cf8b907e9e9425b230c3d548111efc661e3704.png"
		}, {
			src: "asset/f70e2db46c301161eaf42922b0cec40ca1f31c21a9fddbfd6fb9998c897e8eb8.png"
		}, {
			src: "asset/0493eb220532c578eb97448040f2814ec73d0ef2ec69de9f63453f14c2cf08fb.png"
		}, {
			src: "asset/8c2c62dc515a4feaaaaea1e726ba169144ef890d0c740ac753e9e8e235a1961d.png"
		}, {
			src: "asset/37b57969648828672b05f3b5662138f2150c9f4af17230b51ca6455991a1a319.png"
		}, {
			src: "asset/0fbc49c2fe5d22f935d437e0049aa969bedc831b8445e064ee2b4da85baa1d70.png"
		}, {
			src: "asset/c80a91d3fe5695c4040e63f675d1063f0578e849c0c5969a0414348e78601d5a.png"
		}, {
			src: "asset/6d1b782354540b035cc732c214b8b47a442fcd1e6d9565699d24ec2b13b8e652.png"
		}, {
			src: "asset/840355510c22bac0a6e52ec0945997b670d8ad1053465d1929d4320ca4150488.png"
		}],
		//var IMAGE_NAMES = ["test.png"];

		SPEED_BUTTON: new Button("speed-button", [{
			src: "asset/button-normal.png",
			value: 1
		}, {
			src: "asset/button-slow.png",
			value: 1 / 4
		}, {
			src: "asset/button-slower.png",
			value: 1 / 10
		}, {
			src: "asset/button-slowest.png",
			value: 1 / 60
		}]),

		BOULDER_SIZE_BUTTON: new Button("boulder-size-button", [{
			src: "asset/button-boulder-small.png",
			value: Math.PI * 10
		}, {
			src: "asset/button-boulder-medium.png",
			value: Math.PI * 20
		}, {
			src: "asset/button-boulder-large.png",
			value: Math.PI * 40
		}]),

		BOULDER_COUNT_BUTTON: new Button("boulder-count-button", [{
			src: "asset/button-boulder-one.png",
			value: 1
		}, {
			src: "asset/button-boulder-few.png",
			value: 3
		}, {
			src: "asset/button-boulder-many.png",
			value: 8
		}], 1),

		DRAW_MOVEMENT_BUTTON: new Button("draw-movement-button", [{
			src: "asset/button-movement-off.png",
			value: false
		}, {
			src: "asset/button-movement-on.png",
			value: true
		}], 0, function(value) {
			require("Global").DRAW_MOVEMENT = value;
		}),

		DRAW_PROJECTIONS_BUTTON: new Button("draw-projections-button", [{
			src: "asset/button-projections-off.png",
			value: false
		}, {
			src: "asset/button-projections-on.png",
			value: true
		}], 0, function(value) {
			require("Global").DRAW_PROJECTIONS = value;
		}),


		// Precalculated mirror vectors according to following schema (+ ist the impact location):
		//     y
		//     ^   
		//     |
		//     1
		// --8-+-2--> x
		//     4
		//     |
		// If bit is set, there is sand!
		MIRROR_NORMALS: [
		new Vector(0, - 1).normalize(), // 0
		new Vector(0, - 1).normalize(), // 1
		new Vector(-1, 0).normalize(), // 2
		new Vector(-1, - 1).normalize(), // 3
		new Vector(0, 1).normalize(), // 4
		new Vector(0, 1).normalize(), // 5
		new Vector(-1, 1).normalize(), // 6
		new Vector(-1, 0).normalize(), // 7
		new Vector(1, 0).normalize(), // 8
		new Vector(1, - 1).normalize(), // 9
		new Vector(0, 1).normalize(), // 10
		new Vector(0, - 1).normalize(), // 11
		new Vector(1, 1).normalize(), // 12
		new Vector(1, 0).normalize(), // 13
		new Vector(0, - 1).normalize(), // 14
		new Vector(1, 0).normalize()], // 15

		IMAGES: [],
		SAND: null,
		PARTICLES: [],
		PENDING_PARTICLES: [],

		/**
		 * Add a particle to the pending particles 
		 */
		addParticle: function(particle) {
			this.PENDING_PARTICLES.push(particle);
		},

		/**
		 * Activates pending particles 
		 */
		activatePendingParticles: function() {
			for (var i = 0; i < this.PENDING_PARTICLES.length; i += 1) {
				if (this.PARTICLES.length >= this.MAX_PARTICLES) {
					// maximum particles reached, save the rest for later
					break;
				}

				// create particle
				this.PARTICLES.push(this.PENDING_PARTICLES[i]);
			}

			// remove executed particles
			this.PENDING_PARTICLES.splice(0, i);
		},

		/**
		 * Update and draw the particles
		 */
		updateParticles: function(duration, context) {
			for (var i = 0; i < this.PARTICLES.length; i += 1) {
				this.PARTICLES[i].move(duration);
				this.PARTICLES[i].draw(context);
			}
		},

		/**
		 * Remove dead particles
		 */
		removeDeadParticles: function() {
			var i = 0;

			while (i < this.PARTICLES.length) {
				if (!this.PARTICLES[i].alive) {
					this.PARTICLES.splice(i, 1);
				} else {
					i += 1;
				}
			}
		},

		/**
		 * Removes all particles
		 */
		clearParticles: function() {
			this.PARTICLES = [];
			this.PENDING_PARTICLES = [];
		}
	};
});