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
	Global.PARTICLE_PROJECTION_DEFLECTION = Math.PI * 0.05;

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

		radius: function() {
			return Math.sqrt(this.mass / Math.PI);
		},

		direction: function() {
			return this.movement.direction();
		},

		velocity: function() {
			return this.movement.length();
		},

		move: function(dt) {
			// update the particles own rotation
			this.rotation += this.rotationSpeed * dt;
			//this.rotationSpeed *= (1 - dt);

			// apply gravity to particle
			this.movement.sub(0, 0.5 * 667.384 * dt);

			// apply air drag
			// the size of one grain: 0.01m
			// the drag of a ball (Cw=0.45) air (density=1.2041)
			//var drag = 0.45 * this.mass * 0.5 * 1.2041 * (this.velocity() * this.velocity());
			//var acceleration = drag / this.mass;

			// the mementum of the particle
			//var momentum = this.mass * this.velocity();

			//Util.message(this.velocity().toFixed(3) + ", " + (acceleration).toFixed(3));
			this.movement.multiplyScalar(1 - (Global.AIR_FRICTION * dt));
			//this.movement.setLength(this.velocity() - acceleration*dt);

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
				if (Global.SAND.get(x, y) > Global.THRESHOLD) {
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
			/*
			if ((this.alive) && (Math.random() < dt * 5) && (this.mass > Math.PI)) {
				var loose = Math.random() * this.mass * 0.5;
				
				this.mass -= loose;
				
				console.log(this.mass + ", " + loose);
				Global.addParticle(new Particle(this.position.clone(), this.movement.clone(), loose), true);
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
			var radius = this.radius();

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

			index |= (Global.SAND.get(this.position.x - 1, this.position.y - 1) > Global.THRESHOLD) ? 9 : 0;
			index |= (Global.SAND.get(this.position.x, this.position.y - 1) > Global.THRESHOLD) ? 1 : 0;
			index |= (Global.SAND.get(this.position.x + 1, this.position.y - 1) > Global.THRESHOLD) ? 3 : 0;
			index |= (Global.SAND.get(this.position.x + 1, this.position.y) > Global.THRESHOLD) ? 2 : 0;
			index |= (Global.SAND.get(this.position.x + 1, this.position.y + 1) > Global.THRESHOLD) ? 6 : 0;
			index |= (Global.SAND.get(this.position.x, this.position.y + 1) > Global.THRESHOLD) ? 4 : 0;
			index |= (Global.SAND.get(this.position.x - 1, this.position.y + 1) > Global.THRESHOLD) ? 12 : 0;
			index |= (Global.SAND.get(this.position.x - 1, this.position.y) > Global.THRESHOLD) ? 8 : 0;

			var mirrorNormal = Global.PARTICLE_MIRROR_NORMALS[index];

			// trigger the explosion
			var maxDist = radius * radius;
			var remainingMomentum = 0;
			var usedMomentum = 0;
			var unusedMomentum = 0;
			var lostMass = 0;

			// find the multiplication factor (the forEachPixelInCircle isn't very accurate)
			var factor = 0;

			Util.forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
				factor += value;
			});

			factor = this.mass / factor;

			//alert(velocity * this.mass);
			// project the impact momentum to all particles
			Util.forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
				var grain = Global.SAND.get(posX, posY) * value * factor;

				// calculate the approximate mass of the part, that hit the grain, which always happens to be 1 or less
				var mass = Math.min(value * factor, self.mass);
				var momentum = mass * velocity;

				if (grain) {
					usedMomentum += momentum;

					// project the mass and the momentum (the direction varies a bit)
					var info = {
						additionalMass: mass
					};

					// the force spreads out
					var spread = (Math.random() - 0.5) * Global.PARTICLE_IMPACT_SPREAD;

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
					this.movement.setLength(Math.min(momentum / this.mass, this.velocity()));
				} else if (momentum < 0) {
					// the particle bounces back
					// adjust the velocity to the momentum, but do not speed up
					this.movement.setLength(Math.min(Math.abs(momentum) * Global.BOUNCYNESS / this.mass, this.velocity()));

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

			// there is fricion, it absorbes momentum, too, if it should get a particle moving
			var friction = grain * Global.FRICTION * Global.N * Global.BOUNCYNESS;

			// some of the momentum is beeing absorbed on each projection cycle
			var absorbedMomentum = momentum * Global.ABSORBSION;
			momentum -= absorbedMomentum;

			if (momentum < friction) {
				// not enough momentum to do anything, bounce back
				return -momentum;
			}

			// track the particles path, the particle may project its momentum
			var movement = new Vector().setDirection(direction, 1);
			var position = new Vector(x, y).add(movement.x, movement.y);
			var nextGrain = Global.SAND.get(position.x, position.y);

			if (nextGrain > Global.THRESHOLD) {
				if (Global.DRAW_PROJECTIONS) {
					Global.SAND.draw(position.x, position.y, "red");
				}

				// there is a particle in the way, project the momentum
				var deflection = (Math.random() - 0.5) * Global.PARTICLE_PROJECTION_DEFLECTION;
				momentum = this.projectMomentum(dt, position.x, position.y, direction + deflection, velocity, momentum, info, true);

				// when bouncing back, some of the absorbed momentum is freed again (in the opposite direction)
				momentum -= absorbedMomentum * Global.BOUNCYNESS;
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

			var mass = grain;

			if (!projected) {
				// add the additional mass if it is initial call
				mass += info.additionalMass;
				info.additionalMassUsed = true;
			}

			var consumedMomentum = Math.min(mass * velocity, Math.abs(momentum));
			var useableMomentum = consumedMomentum * Global.BOUNCYNESS - friction;

			if (momentum <= 0) {
				momentum += consumedMomentum;
			} else {
				momentum -= consumedMomentum;
			}

			movement.setLength(Math.max(useableMomentum / mass, 0));

			position.set(x, y);

			var particle = new Particle(position, movement, mass);

			Global.addParticle(particle);
			//Global.SAND.remove(position.x, position.y, grain);

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

			if (Global.SAND.get(this.position.x, this.position.y + 1) <= Global.THRESHOLD) {
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
			// HELLO. PLEASE, FOLLOW ME...
			Global.SAND.add(this.position.x, this.position.y, this.mass);
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

			var scale = Math.max(this.radius(), 0.7) / Global.PARTICLE_RADIUS;
			context.scale(scale, scale);
			context.rotate(this.rotation);
			context.drawImage(Global.IMAGES.particle, - Global.PARTICLE_RADIUS, - Global.PARTICLE_RADIUS);
			context.restore();
		}
	};

	return Particle;
});