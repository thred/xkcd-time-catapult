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

define("Global", [], function() {
	return {
		WIDTH: 800,
		HEIGHT: 390,

		MAX_PARTICLES: 1024,
		DRAW_PROJECTIONS: false,
		DRAW_MOVEMENT: false,

		XKCD_IMAGES: [{
			src: "asset/a228595caf108b46e53f4fe276ebac8fa1545928b650742b0812298d5dfde441.png",
			sizeOfPixel: 1.8 / 64, // 64 pixel are one m
			launchVelocityPerPixel: 0.067
		}, {
			src: "asset/c918850ed18afe2c3f3acbeef9c799aba5b10a8efeb45a2f026565383f0a72bc.png",
			sizeOfPixel: 1.8 / 64, // 64 pixel are one m
			launchVelocityPerPixel: 0.067
		}, {
			src: "asset/05457c91f50c216f6071ae194b4d1822770e1792b0c73eb0fba3cbbdeb616ec2.png",
			sizeOfPixel: 1.8 / 42, // 42 pixel are one m
			launchVelocityPerPixel: 0.0825
		}, {
			src: "asset/dcbe928012a06ae5118d4cd3850a4f1bcc0a7e4e86b2c04751fe79370cbb35bc.png",
			sizeOfPixel: 1.8 / 35, // 35 pixel are one m
			launchVelocityPerPixel: 0.0905
		}, {
			src: "asset/9996f99ec0e08c63b8f50c9900c73ba37417fdeef2a17888748cc0c078370b82.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/37eba4d7ce0239d5d8b8aac659f464569debe088399ec70f6ac54036a82640a5.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/8beeb30463e7b617e56403c7d7cf8b907e9e9425b230c3d548111efc661e3704.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/f70e2db46c301161eaf42922b0cec40ca1f31c21a9fddbfd6fb9998c897e8eb8.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/0493eb220532c578eb97448040f2814ec73d0ef2ec69de9f63453f14c2cf08fb.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/8c2c62dc515a4feaaaaea1e726ba169144ef890d0c740ac753e9e8e235a1961d.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/37b57969648828672b05f3b5662138f2150c9f4af17230b51ca6455991a1a319.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/0fbc49c2fe5d22f935d437e0049aa969bedc831b8445e064ee2b4da85baa1d70.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/c80a91d3fe5695c4040e63f675d1063f0578e849c0c5969a0414348e78601d5a.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/6d1b782354540b035cc732c214b8b47a442fcd1e6d9565699d24ec2b13b8e652.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/840355510c22bac0a6e52ec0945997b670d8ad1053465d1929d4320ca4150488.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/27994b77661281b2d0301e93c53a49f348ec3b417ffc0da4aeab57d9703ed1fe.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}, {
			src: "asset/6d28391eaa775cd8f1f3814a58369483c2933dc21ca94c27d8fdbc4b29574bbc.png",
			sizeOfPixel: 1.8 / 33, // 33 pixel are one m
			launchVelocityPerPixel: 0.094
		}],
		//var IMAGE_NAMES = ["test.png"];

		IMAGES: [],
		SAND: null,
		PARTICLES: [],
		PREPARED_PARTICLES: [],
		PENDING_PARTICLES: [],

		/**
		 * Add a particle to the pending particles 
		 */
		addParticle: function(particle, important) {
			if (important) {
				this.PENDING_PARTICLES.splice(0, 0, particle);
			}
			else {
				this.PENDING_PARTICLES.push(particle);
			}
		},
		
		/**
		 * Add a particle per location (mutiple particles are merged)
		 */
		prepareParticle: function(particle) {
			var x = Math.round(particle.position.x);
			var y = Math.round(particle.position.y);
			
			if ((x < 0) || (y < 0) || (x >= this.WIDTH) || (y >= this.HEIGHT)) {
				return;
			}
			
			var pos = x + y * this.WIDTH;
			var existing = this.PREPARED_PARTICLES[pos];
			
			if (!existing) {
				this.PREPARED_PARTICLES[pos] = particle;
				return;
			}
			
			existing.position.average(particle.position.x, particle.position.y);
			existing.movement.average(particle.movement.x, particle.movement.y);
			existing.mass += particle.mass;
		},

		/**
		 * Activates pending particles 
		 */
		activatePendingParticles: function() {
			for (var idx in this.PREPARED_PARTICLES) {
				var particle = this.PREPARED_PARTICLES[idx];
				
				particle.mass += this.SAND.get(particle.position.x, particle.position.y) * this.PARTICLE_MASS_PER_PIXEL;
				
				this.PENDING_PARTICLES.push(particle);
			}

			this.PREPARED_PARTICLES = [];
		
			for (var i = 0; i < this.PENDING_PARTICLES.length; i += 1) {
				if (this.PARTICLES.length >= this.MAX_PARTICLES) {
					// maximum particles reached, save the rest for later
					break;
				}

				// create particle
				var particle = this.PENDING_PARTICLES[i];
				
				this.PARTICLES.push(particle);
				this.SAND.remove(particle.position.x, particle.position.y, particle.mass);
			}

			// remove executed particles
			this.PENDING_PARTICLES.splice(0, i);
		},

		/**
		 * Update and draw the particles
		 */
		updateParticles: function(duration, context) {
			var totalMovingMass = 0;
			var totalMaxVelocity = 0;
			
			for (var i = 0; i < this.PARTICLES.length; i += 1) {
				var particle = this.PARTICLES[i];
				
				particle.move(duration);

				totalMovingMass += particle.mass;
				totalMaxVelocity = Math.max(totalMaxVelocity, particle.velocity());

				particle.draw(context);

			}
			
			return {
				movingMass : totalMovingMass,
				maxVelocity : totalMaxVelocity
			};
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
			this.PREPARED_PARTICLES = [];
			this.PENDING_PARTICLES = [];
		}
	};
});
