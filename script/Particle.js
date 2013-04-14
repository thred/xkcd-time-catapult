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

define("Particle", ["Global", "Util", "Vector"], function(Global, Util, Vector) {

	Global.PARTICLE_RADIUS = 6; // the image is 12x12

	Global.PARTICLE_IMPACT_SPREAD = Math.PI;
	Global.PARTICLE_PROJECTION_DEFLECTION = Math.PI * 0.2;

	Global.setupParticleConstants = function(sizeOfPixel, planet) {
		Global.G = planet.g;
		Global.PARTICLE_SIZE_OF_PIXEL = sizeOfPixel; // 1.8 / 34; // 34 pixel are 1.8m, this may differ per image
		Global.PARTICLE_DENSITY = 2000; // density of sand in kg/m³
		Global.PARTICLE_MASS_PER_PIXEL = Math.pow(Global.PARTICLE_SIZE_OF_PIXEL, 3) * Global.PARTICLE_DENSITY; // in kg
		Global.PARTICLE_FRICTION = 0.4; // Brick Masonry on sand, in µ
		Global.PARTICLE_THRESHOLD = 0.1; // when a pixel is considered (0 is white, 0.5 is gray, 1 is black)

		// these two variables define the absorbsion and bouncyness of the sand
		// these values are incorrect. Sand absorbes a lot of momentum, and does not bounce. But wheres the fun?
		Global.PARTICLE_ABSORBSION = 5 / 100; // momentum absorbed on impact in %
		Global.PARTICLE_BOUNCYNESS = 50 / 100; // momentum bouncing back on impact in %.

		Util.messageTo("planet", planet.name);
		Util.messageTo("g", Global.G.toFixed(2));
		Util.messageTo("particle_density", Math.round(Global.PARTICLE_DENSITY));
		Util.messageTo("size_of_pixel", (Global.PARTICLE_SIZE_OF_PIXEL * 100).toFixed(2));
		Util.messageTo("mass_per_pixel", Global.PARTICLE_MASS_PER_PIXEL.toFixed(2));
		Util.messageTo("particle_friction", Global.PARTICLE_FRICTION.toFixed(2));
		Util.messageTo("particle_absorbsion", Math.round(Global.PARTICLE_ABSORBSION * 100));
		Util.messageTo("particle_bouncyness", Math.round(Global.PARTICLE_BOUNCYNESS * 100));
	};

	// Precalculated mirror vectors according to following schema (+ ist the impact location):
	//     y
	//     ^   
	//     |
	//     1
	// --8-+-2--> x
	//     4
	//     |
	// If bit is set, there is sand!
	Global.PARTICLE_MIRROR_NORMALS = [
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
	new Vector(1, 0).normalize()]; // 15

	function Particle(position, movement, mass) {
		this.position = position;
		this.movement = movement;
		this.mass = mass;
		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed = Math.random() * 20;
		this.stuckDT = 0;
		this.alive = true;
	}

	Particle.prototype = {

		constructor: Particle,

		/**
		 * Returns the radius in m
		 */
		radius: function() {
			return 0.751501 * Math.pow(this.mass / Global.PARTICLE_DENSITY, 1 / 3);
		},

		direction: function() {
			return this.movement.direction();
		},

		/**
		 * Returns the velocity in m/s
		 */
		velocity: function() {
			return this.movement.length() * Global.PARTICLE_SIZE_OF_PIXEL;
		},

		setVelocity: function(value) {
			this.movement.setLength(value / Global.PARTICLE_SIZE_OF_PIXEL);
		},

		move: function(dt) {
			// update the particles own rotation
			this.rotation += this.rotationSpeed * dt;

			// apply gravity to particle
			this.movement.add(0, - Global.G / Global.PARTICLE_SIZE_OF_PIXEL * dt);

			// apply air drag
			// the drag of a ball (Cw=0.45) in air (density=1.2041 kg/m³, at 20°C)
			var drag = 0.5 * 0.45 * 1.2041 * (Math.pow(this.radius(), 2) * Math.PI);
			this.setVelocity(1 / ((drag / this.mass) * dt + 1 / this.velocity()));

			// calculate the movement of the particle
			var startX = this.position.x;
			var startY = this.position.y;
			var vx = this.movement.x * dt;
			var vy = this.movement.y * dt;

			// check the path for impact
			var length = Math.ceil(Math.max(Math.abs(vx), Math.abs(vy)));

			for (var i = 0; i <= length; i += 1) {
				// compute the impact position
				var x = startX + vx * i / length;
				var y = startY - vy * i / length;

				// check impact on path
				if (Global.SAND.get(x, y) > Global.PARTICLE_THRESHOLD) {
					// there was an impact
					this.impact(dt, x, y);
					break;
				}

				// set the new position, nothings there
				this.position.set(x, y);
			}

			// check for stuck particles
			if ((startX == this.position.x) && (startY == this.position.y)) {
				// stuck, increase counter
				this.stuckDT += dt;
			} else {
				// the particle isn't stuck
				this.stuckDT = 0;
			}

			if ((this.position.x < 0) || (this.position.x >= Global.WIDTH) || (this.position.y >= Global.HEIGHT)) {
				// the particle has left the screen, kill it
				this.alive = false;
			}

			// sand is not stable, maybe it splits
			/*
			if ((this.alive) && (Math.random() < dt * 0.5) && (this.radius() / Global.PARTICLE_SIZE_OF_PIXEL > 1.5)) {
				var loose = this.mass * 0.25 + Math.random() * this.mass * 0.5;

				this.mass -= loose;
				
				var movement = this.movement.clone().setLength(this.movement.length() - this.movement.length() * 0.05 * Math.random());

				Global.addParticle(new Particle(this.position.clone(), movement, loose), true);
			}
			*/
		},

		/**
		 * particle had impact 
		 */
		impact: function(dt, x, y) {
			var self = this;
			var direction = this.direction();
			var velocity = this.velocity();
			var radiusInPixel = this.radius() / Global.PARTICLE_SIZE_OF_PIXEL;

			// calculate the vector for mirroring the movement of the particle
			// this must be done before the explosion, otherwise there is no sand for calculating the mirror anymore
			//     y
			//     ^   
			//     |
			//   9 1 3
			// --8-+-2--> x
			//   c 4 6
			//     |
			// If bit is set, there is sand!
			var index = 0;

			index |= (Global.SAND.get(this.position.x - 1, this.position.y - 1) > Global.PARTICLE_THRESHOLD) ? 9 : 0;
			index |= (Global.SAND.get(this.position.x, this.position.y - 1) > Global.PARTICLE_THRESHOLD) ? 1 : 0;
			index |= (Global.SAND.get(this.position.x + 1, this.position.y - 1) > Global.PARTICLE_THRESHOLD) ? 3 : 0;
			index |= (Global.SAND.get(this.position.x + 1, this.position.y) > Global.PARTICLE_THRESHOLD) ? 2 : 0;
			index |= (Global.SAND.get(this.position.x + 1, this.position.y + 1) > Global.PARTICLE_THRESHOLD) ? 6 : 0;
			index |= (Global.SAND.get(this.position.x, this.position.y + 1) > Global.PARTICLE_THRESHOLD) ? 4 : 0;
			index |= (Global.SAND.get(this.position.x - 1, this.position.y + 1) > Global.PARTICLE_THRESHOLD) ? 12 : 0;
			index |= (Global.SAND.get(this.position.x - 1, this.position.y) > Global.PARTICLE_THRESHOLD) ? 8 : 0;

			var mirrorNormal = Global.PARTICLE_MIRROR_NORMALS[index];

			// trigger the explosion
			var remainingMomentum = 0;
			var usedMomentum = 0;
			var unusedMomentum = 0;
			var lostMass = 0;

			// find the multiplication factor (the forEachPixelInCircle isn't very accurate, squaring the circle is hard to do)
			var factor = 0;

			Util.forEachPixelInCircle(x, y, radiusInPixel, function(posX, posY, value) {
				factor += value;
			});

			var volume = Math.PI * Math.pow(radiusInPixel, 2);
			factor = volume / factor;

			// project the impact momentum to all particles
			Util.forEachPixelInCircle(x, y, radiusInPixel, function(posX, posY, value) {
				var grainMass = Global.SAND.get(posX, posY) * Global.PARTICLE_MASS_PER_PIXEL * value * factor;

				// calculate the approximate mass of the part, that hit the grain
				// actually a cylinder is crashing into the sand ;)
				var mass = self.mass / volume * value * factor;
				var momentum = mass * velocity;

				if (grainMass) {
					usedMomentum += momentum;

					var info = {
						additionalMass: mass
					};

					// the force spreads out
					var spread = (Math.random() - 0.5) * Global.PARTICLE_IMPACT_SPREAD;

					// project the mass and the momentum (the direction varies a bit)
					remainingMomentum += self.projectMomentum(dt, posX, posY, direction + spread, velocity, momentum, info, false);

					// the impacting particle looses the mass (it is merged with the grain)
					if (info.additionalMassUsed) {
						lostMass += mass;
					}
				} else {
					// didn't need the momentum
					unusedMomentum += momentum;
				}
			});

			var momentum = remainingMomentum + unusedMomentum;

			if (this.mass > 0) {
				if (momentum > 0) {
					// the particle continues it's path
					// adjust the velocity to the momentum, but do not speed up
					this.setVelocity(Math.min(momentum / this.mass, this.velocity()));
				} else if (momentum < 0) {
					// the particle bounces back
					// adjust the velocity to the momentum, but do not speed up
					this.setVelocity(Math.min(Math.abs(momentum) * Global.PARTICLE_BOUNCYNESS / this.mass, this.velocity()));

					// mirror the movement of the particle along the mirror vector
					this.movement.mirror(mirrorNormal);
				} else {
					// the particle lost all its momentum
					this.movement.setLength(0);
				}

				this.mass -= lostMass;
			}

			if (this.suggestDeath(dt)) {
				return;
			}
		},

		/**
		 * Projects the momentum to all particles in the specified direction.
		 *
		 * @return the remaining momentum
		 */
		projectMomentum: function(dt, x, y, direction, velocity, momentum, info, projected) {
			var grain = Global.SAND.get(x, y);

			if (!grain) {
				// there is no sand (anymore)
				return momentum;
			}

			var mass = grain * Global.PARTICLE_MASS_PER_PIXEL;

			// there is fricion, it absorbes momentum, too, if it should get a particle moving
			var frictionMomentum = mass * Global.PARTICLE_FRICTION * Global.G;

			// some of the momentum is beeing absorbed on each projection cycle
			var absorbedMomentum = momentum * Global.PARTICLE_ABSORBSION;
			momentum -= absorbedMomentum;

			if (momentum < frictionMomentum) {
				// not enough momentum to do anything, bounce back
				return -momentum;
			}

			// track the particles path, the particle may project its momentum
			var movement = new Vector().setDirection(direction, 1);
			var position = new Vector(x, y).add(movement.x, movement.y);
			var nextGrain = Global.SAND.get(position.x, position.y);

			if (nextGrain > Global.PARTICLE_THRESHOLD) {
				if (Global.DRAW_PROJECTIONS) {
					Global.SAND.draw(position.x, position.y, "red");
				}

				// there is a particle in the way, project the momentum
				// This is where science ends. The sand is basically a liquid with density and so on.
				// Your computer is not powerful enough to compute this. 
				// Instead random projections are used.
				var deflection = (Math.random() - 0.5) * Global.PARTICLE_PROJECTION_DEFLECTION;
				momentum = this.projectMomentum(dt, position.x, position.y, direction + deflection, velocity, momentum, info, true);

				// when bouncing back, some of the absorbed momentum is freed again (in the opposite direction)
				momentum -= absorbedMomentum * Global.PARTICLE_BOUNCYNESS;
			}

			// the momentum may be positive here, which indicates a forward movement
			// or negative, whick indicates a bounce back

			grain = Global.SAND.get(x, y);

			if (!grain) {
				// calculating same location twice, ignore
				return momentum;
			}

			if ((momentum <= 0) && (projected)) {
				// projecting the momentum back
				return momentum;
			}

			mass = grain * Global.PARTICLE_MASS_PER_PIXEL;

			if (!projected) {
				// add the additional mass if it is initial call
				mass += info.additionalMass;
				info.additionalMassUsed = true;
			}

			// how much mementum is consumed, how much bounces back
			var consumedMomentum = Math.min(mass * velocity, Math.abs(momentum));
			var useableMomentum = consumedMomentum * (1 - Global.PARTICLE_BOUNCYNESS) - frictionMomentum;

			if (momentum <= 0) {
				momentum += consumedMomentum;
			} else {
				momentum -= consumedMomentum;
			}

			position.set(x, y);
			
			// prepare the particle (the grain will be added on creation)
			var particle = new Particle(position, movement, (!projected) ? info.additionalMass : 0);

			particle.setVelocity(Math.max(useableMomentum / mass, 0));
			Global.prepareParticle(particle);

			return momentum;
		},

		suggestDeath: function(dt) {
			if (this.mass <= 0) {
				// the particle has no mass anymore, DBA
				this.alive = false;
				return true;
			}

			if (this.stuckDT > 0.25) {
				// the particle is stuck, that happens sometimes
				return this.kill();
			}

			if (Global.SAND.get(this.position.x, this.position.y + 1) <= Global.PARTICLE_THRESHOLD) {
				// there is no sand below the particle
				return false;
			}

			if (this.movement.length() > Global.G * dt) {
				// the particle has too much speed, it won't rest here
				return false;
			}

			// safe to kill
			return this.kill();
		},

		kill: function() {
			// HELLO SANDGRAIN. THOU SHALT REST!
			Global.SAND.add(this.position.x, this.position.y, this.mass);
			Global.unstableParticle(this.position.x, this.position.y);
			
			this.alive = false;
			return true;
		},

		draw: function(context) {
			context.save();
			context.translate(this.position.x, this.position.y);

			if (Global.DRAW_MOVEMENT) {
				context.strokeStyle = "#aaaaff";
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(this.movement.x * 0.1, - this.movement.y * 0.1);
				context.stroke();
			}

			var scale = Math.max(this.radius() / Global.PARTICLE_SIZE_OF_PIXEL, 0.7) / Global.PARTICLE_RADIUS;
			context.scale(scale, scale);
			context.rotate(this.rotation);
			context.drawImage(Global.IMAGES.particle, - Global.PARTICLE_RADIUS, - Global.PARTICLE_RADIUS);
			context.restore();
		}
	};

	return Particle;
});
