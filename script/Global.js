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

var BASES = {
	def: {
		src: "asset/base.png",
		yOffset: -56
	},

	megan: {
		src: "asset/megan.png",
		yOffset: -96
	},

	gorillas: {
		src: "asset/gorillas-base.png",
		yOffset: -103
	}
};


define("Global", [], function() {
	return {
		WIDTH: 800,
		HEIGHT: 390,

		MAX_PARTICLES: 2048,
		DRAW_COMPACTNESS: false,
		DRAW_PROJECTIONS: false,
		DRAW_MOVEMENT: false,
		COLLAPSING: true,

		XKCD_IMAGES: [{
			name: "megan",
			src: "asset/0fbc49c2fe5d22f935d437e0049aa969bedc831b8445e064ee2b4da85baa1d70-alt.png",
			base: BASES.megan,
			baseOffsetY: 270,
			sizeOfPixel: 1 / 154.5,
			launchVelocityPerPixel: 0.0318
		}, {
			name: "a228",
			src: "asset/a228595caf108b46e53f4fe276ebac8fa1545928b650742b0812298d5dfde441.png",
			base: BASES.def,
			baseOffsetY: 267,
			sizeOfPixel: 1.8 / 64,
			launchVelocityPerPixel: 0.067
		}, {
			name: "c918",
			src: "asset/c918850ed18afe2c3f3acbeef9c799aba5b10a8efeb45a2f026565383f0a72bc.png",
			base: BASES.def,
			baseOffsetY: 268,
			sizeOfPixel: 1.8 / 64,
			launchVelocityPerPixel: 0.067
		}, {
			name: "0545",
			src: "asset/05457c91f50c216f6071ae194b4d1822770e1792b0c73eb0fba3cbbdeb616ec2.png",
			base: BASES.def,
			baseOffsetY: 247,
			sizeOfPixel: 1.8 / 42,
			launchVelocityPerPixel: 0.0825
		}, {
			name: "dcbe",
			src: "asset/dcbe928012a06ae5118d4cd3850a4f1bcc0a7e4e86b2c04751fe79370cbb35bc.png",
			base: BASES.def,
			baseOffsetY: 244,
			sizeOfPixel: 1.8 / 35,
			launchVelocityPerPixel: 0.0905
		}, {
			name: "9996",
			src: "asset/9996f99ec0e08c63b8f50c9900c73ba37417fdeef2a17888748cc0c078370b82.png",
			base: BASES.def,
			baseOffsetY: 270,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "37eb",
			src: "asset/37eba4d7ce0239d5d8b8aac659f464569debe088399ec70f6ac54036a82640a5.png",
			base: BASES.def,
			baseOffsetY: 270,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "8bee",
			src: "asset/8beeb30463e7b617e56403c7d7cf8b907e9e9425b230c3d548111efc661e3704.png",
			base: BASES.def,
			baseOffsetY: 270,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "f70e",
			src: "asset/f70e2db46c301161eaf42922b0cec40ca1f31c21a9fddbfd6fb9998c897e8eb8.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "0493",
			src: "asset/0493eb220532c578eb97448040f2814ec73d0ef2ec69de9f63453f14c2cf08fb.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094

		}, {
			name: "8c2c",
			src: "asset/8c2c62dc515a4feaaaaea1e726ba169144ef890d0c740ac753e9e8e235a1961d.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "37b5",
			src: "asset/37b57969648828672b05f3b5662138f2150c9f4af17230b51ca6455991a1a319.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "0fbc",
			src: "asset/0fbc49c2fe5d22f935d437e0049aa969bedc831b8445e064ee2b4da85baa1d70.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "c80a",
			src: "asset/c80a91d3fe5695c4040e63f675d1063f0578e849c0c5969a0414348e78601d5a.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "6d1b",
			src: "asset/6d1b782354540b035cc732c214b8b47a442fcd1e6d9565699d24ec2b13b8e652.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "8403",
			src: "asset/840355510c22bac0a6e52ec0945997b670d8ad1053465d1929d4320ca4150488.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "2799",
			src: "asset/27994b77661281b2d0301e93c53a49f348ec3b417ffc0da4aeab57d9703ed1fe.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "760f",
			src: "asset/760f03109299cc8f8a704aa7a005151361ab470c3baa38a0aeb569311c1b1118.png",
			base: BASES.def,
			baseOffsetY: 271,
			sizeOfPixel: 1.8 / 33,
			launchVelocityPerPixel: 0.094
		}, {
			name: "gorillas",
			src: "asset/gorillas.png",
			base: BASES.gorillas,
			baseOffsetY: 270,
			sizeOfPixel: 10 / 52, // 52 pixel are 10 m
			launchVelocityPerPixel: 0.2,
			secret: true
		}],

		IMAGES: {},
		SAND: null,
		PARTICLES: [],
		PREPARED_PARTICLES: {},
		PENDING_PARTICLES: [],
		UNSTABLE_PARTICLES: {},

		/**
		 * Add a particle to the pending particles 
		 */
		addParticle: function(particle, important) {
			if (important) {
				this.PENDING_PARTICLES.splice(0, 0, particle);
			} else {
				this.PENDING_PARTICLES.push(particle);
			}
		},

		/**
		 * Prepare a particle to be added to the pending particles (mutiple particles are merged)
		 */
		prepareParticle: function(particle) {
			var x = Math.round(particle.position.x);
			var y = Math.round(particle.position.y);

			if ((x < 0) || (y < 0) || (x >= this.WIDTH) || (y >= this.HEIGHT)) {
				return;
			}

			var pos = x + (this.HEIGHT - y - 1) * this.WIDTH; // bottom up when iterating
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
		 * Adds al valid, prepared particles to the pending particles
		 */
		activatePreparedParticles: function() {
			for (var idx in this.PREPARED_PARTICLES) {
				var preparedParticle = this.PREPARED_PARTICLES[idx];
				var mass = preparedParticle.mass + this.SAND.get(preparedParticle.position.x, preparedParticle.position.y) * this.PARTICLE_MASS_PER_PIXEL;

				if (mass > 0) {
					preparedParticle.mass += this.SAND.get(preparedParticle.position.x, preparedParticle.position.y) * this.PARTICLE_MASS_PER_PIXEL;

					this.PENDING_PARTICLES.push(preparedParticle);
				}
			}

			this.PREPARED_PARTICLES = {};
		},

		/**
		 * Not a particle as unstable (it may roll to the left or right)
		 */
		unstableParticle: function(x, y) {
			if (!this.COLLAPSING) {
				return;
			}

			x = Math.round(x);
			y = Math.round(y);

			if ((x < 0) || (y < 0) || (x >= this.WIDTH) || (y >= this.HEIGHT)) {
				return;
			}

			var sand = this.SAND.get(x, y);

			if (sand <= this.PARTICLE_THRESHOLD) {
				return;
			}

			//var pos = x + (this.HEIGHT - y - 1) * this.WIDTH; // bottom up when iterating 
			var pos = x + y * this.WIDTH;
			this.UNSTABLE_PARTICLES[pos] = true;
		},

		activateUnstableParticles: function() {
			if (!this.COLLAPSING) {
				return;
			}

			var Particle = require("Particle");
			var Vector = require("Vector");
			var count;

			do {
				count = 0;

				for (var idx in this.UNSTABLE_PARTICLES) {
					if (this.PARTICLES.length + this.PENDING_PARTICLES.length >= this.MAX_PARTICLES) {
						// maximum particles reached, save the rest for later
						return;
					}

					count += 1;
					delete this.UNSTABLE_PARTICLES[idx];

					var x = idx % this.WIDTH;
					//var y = this.HEIGHT - 1 - parseInt(idx / this.WIDTH, 10); // bottom up when iterating 
					var y = parseInt(idx / this.WIDTH, 10);

					var sand = this.SAND.get(x, y);

					if (sand <= this.PARTICLE_THRESHOLD) {
						// there's no sand anymore
						continue;
					}

					var pos = x + (this.HEIGHT - y - 1) * this.WIDTH;

					if (this.SAND.get(x, y + 1) <= this.PARTICLE_THRESHOLD) {
						// there's no sand below
						this.addParticle(new Particle(new Vector(x, y), new Vector((Math.random() - 0.5) * 2 * 10, 0), sand * this.PARTICLE_MASS_PER_PIXEL));
						this.SAND.removeMass(x, y, sand * this.PARTICLE_MASS_PER_PIXEL);
						this.unstableParticle(x, y - 1);
						continue;
					}

					var leftSand = this.SAND.get(x - 1, y + 1);
					var rightSand = this.SAND.get(x + 1, y + 1);

					if ((leftSand > this.PARTICLE_THRESHOLD) && (rightSand > this.PARTICLE_THRESHOLD)) {
						continue;
					}

					var rnd = Math.random();

					if (rnd < this.PARTICLE_FRICTION) {
						continue;
					}

					if ((leftSand <= this.PARTICLE_THRESHOLD) && (rightSand <= this.PARTICLE_THRESHOLD)) {
						if (Math.random() < 0.5) {
							rightSand = 1;
						} else {
							leftSand = 1;
						}
					}

					if (leftSand <= this.PARTICLE_THRESHOLD) {
						// there's no sand below left
						this.addParticle(new Particle(new Vector(x, y), new Vector(-15 + (Math.random() - 0.5) * 2 * 10, 0), sand * this.PARTICLE_MASS_PER_PIXEL));
						this.SAND.removeMass(x, y, sand * this.PARTICLE_MASS_PER_PIXEL);
						this.unstableParticle(x, y - 1);
					} else {
						// there's no sand below right
						this.addParticle(new Particle(new Vector(x, y), new Vector(15 + (Math.random() - 0.5) * 2 * 10, 0), sand * this.PARTICLE_MASS_PER_PIXEL));
						this.SAND.removeMass(x, y, sand * this.PARTICLE_MASS_PER_PIXEL);
						this.unstableParticle(x, y - 1);
					}
				}
			}
			while (count > 0);
		},

		/**
		 * Activates pending particles 
		 */
		activatePendingParticles: function() {
			var Particle = require("Particle");
			var Vector = require("Vector");

			this.activatePreparedParticles();

			for (var i = 0; i < this.PENDING_PARTICLES.length; i += 1) {
				if (this.PARTICLES.length >= this.MAX_PARTICLES) {
					// maximum particles reached, save the rest for later
					break;
				}

				// create particle
				var pendingParticle = this.PENDING_PARTICLES[i];

				this.PARTICLES.push(pendingParticle);
				this.SAND.removeMass(pendingParticle.position.x, pendingParticle.position.y, pendingParticle.mass);

				this.unstableParticle(pendingParticle.position.x, pendingParticle.position.y - 1);
				this.unstableParticle(pendingParticle.position.x - 1, pendingParticle.position.y);
				this.unstableParticle(pendingParticle.position.x + 1, pendingParticle.position.y);
			}

			// remove executed particles
			this.PENDING_PARTICLES.splice(0, i);

			this.activateUnstableParticles();
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
				movingMass: totalMovingMass,
				maxVelocity: totalMaxVelocity
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
			this.PREPARED_PARTICLES = {};
			this.PENDING_PARTICLES = [];
			this.UNSTABLE_PARTICLES = {};
		}
	};
});