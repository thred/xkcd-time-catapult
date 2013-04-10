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

var Particle = function(position, movement, mass) {
		this.position = position;
		this.movement = movement;
		this.mass = mass;
		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed = Math.random() * 20;
		this.stuckDuration = 0;
		this.alive = true;
	};

Particle.prototype = {

	constructor: Particle,

	radius: function() {
		return Math.sqrt(this.mass / Math.PI);
	},

	momentum: function() {
		return this.mass * this.velocity();
	},

	velocity: function() {
		return this.movement.length();
	},

	move: function(duration) {
		// update the particles own rotation
		this.rotation += this.rotationSpeed * duration;
		this.rotationSpeed *= (1 - duration);

		// apply gravity to particle
		this.movement.sub(0, 0.5 * 667.384 * duration);

		// apply air friction
		this.movement.multiplyScalar(1 - (AIR_FRICTION * duration));

		// calculate the movement of the particle
		var startX = this.position.x;
		var startY = this.position.y;
		var vx = this.movement.x * duration;
		var vy = this.movement.y * duration;

		// check the path for impact
		var length = Math.ceil(Math.max(Math.abs(vx), Math.abs(vy)));

		for (var i = 0; i <= length; i += 1) {
			// compute the impact position
			var x = startX + vx * i / length;
			var y = startY - vy * i / length;

			// check impact on path
			if (sand.get(x, y) > THRESHOLD) {
				// there was an impact
				this.impact(duration, x, y);
				break;
			}

			// set the new position, nothings there
			this.position.set(x, y);
		}

		// check for stuck particles
		if ((startX == this.position.x) && (startY == this.position.y)) {
			// stuck, increase counter
			this.stuckDuration += duration;
		} else {
			// the particle isn't stuck
			this.stuckDuration = 0;
		}

		if ((this.position.x < 0) || (this.position.x >= WIDTH) || (this.position.y >= HEIGHT)) {
			// the particle has left the screen, kill it
			this.alive = false;
		}
	},

	/**
	 * particle had impact 
	 */
	impact: function(duration, x, y) {
		var self = this;
		var direction = this.movement.direction();
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

		index |= (sand.get(this.position.x - 1, this.position.y - 1) > THRESHOLD) ? 9 : 0;
		index |= (sand.get(this.position.x, this.position.y - 1) > THRESHOLD) ? 1 : 0;
		index |= (sand.get(this.position.x + 1, this.position.y - 1) > THRESHOLD) ? 3 : 0;
		index |= (sand.get(this.position.x + 1, this.position.y) > THRESHOLD) ? 2 : 0;
		index |= (sand.get(this.position.x + 1, this.position.y + 1) > THRESHOLD) ? 6 : 0;
		index |= (sand.get(this.position.x, this.position.y + 1) > THRESHOLD) ? 4 : 0;
		index |= (sand.get(this.position.x - 1, this.position.y + 1) > THRESHOLD) ? 12 : 0;
		index |= (sand.get(this.position.x - 1, this.position.y) > THRESHOLD) ? 8 : 0;

		var mirrorNormal = MIRROR_NORMALS[index];

		// trigger the explosion
		var maxDist = radius * radius;
		var remainingMomentum = 0;
		var usedMomentum = 0;
		var unusedMomentum = 0;
		var lostMass = 0;

		// find the multiplication factor (the forEachPixelInCircle isn't very accurate)
		var factor = 0;

		forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
			factor += value;
		});

		factor = this.mass / factor;

		//alert(velocity * this.mass);
		// project the impact momentum to all particles
		forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
			var grain = sand.get(posX, posY) * value * factor;

			// calculate the approximate mass of the part, that hit the grain, which always happens to be 1 or less
			var mass = Math.min(value * factor, self.mass);
			var momentum = mass * velocity;

			if (grain) {
				usedMomentum += momentum;

				// project the mass and the momentum (the direction varies a bit)
				var info = {
					additionalMass: mass
				};

				remainingMomentum += self.projectMomentum(duration, posX, posY, direction + (Math.random() - 0.5) * (Math.PI / 2), velocity, momentum, info, false);

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
				this.movement.setLength(Math.min(Math.abs(momentum) * BOUNCYNESS / this.mass, this.velocity()));

				// mirror the movement of the particle along the mirror vector
				this.movement.mirror(mirrorNormal);
			} else {
				// the particle lost all its momentum
				this.movement.setLength(0);
			}

			this.mass -= lostMass;
		}

		if (this.suggestDeath(duration)) {
			return;
		}
	},

	/**
	 * Projects the momentum to all particles in the specified direction.
	 *
	 * @return the remaining momentum
	 */
	projectMomentum: function(duration, x, y, direction, velocity, momentum, info, projected) {
		var grain = sand.get(x, y);

		if (!grain) {
			// there is no sand (anymore)
			return momentum;
		}

		// there is fricion, it absorbes momentum, too, if it should get a particle moving
		var friction = grain * FRICTION * N * BOUNCYNESS;

		// some of the momentum is beeing absorbed on each projection cycle
		var absorbedMomentum = momentum * ABSORBSION;
		momentum -= absorbedMomentum;

		if (momentum < friction) {
			// not enough momentum to do anything, bounce back
			return -momentum;
		}

		// track the particles path, the particle may project its momentum
		var movement = new Vector().setDirection(direction, 1);
		var position = new Vector(x, y).add(movement.x, movement.y);
		var nextGrain = sand.get(position.x, position.y);

		if (nextGrain > THRESHOLD) {
			//sand.draw(position.x, position.y, "red");

			// there is a particle in the way, project the momentum
			momentum = this.projectMomentum(duration, position.x, position.y, direction + (Math.random() - 0.5) * Math.PI * 0.1, velocity, momentum, info, true);

			// when bouncing back, some of the absorbed momentum is freed again (in the opposite direction)
			momentum -= absorbedMomentum * BOUNCYNESS;
		}

		// the momentum may be positive here, which indicates a forward movement
		// or negative, whick indicates a bounce back

		grain = sand.get(x, y);

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
		var useableMomentum = consumedMomentum * BOUNCYNESS - friction;

		if (momentum <= 0) {
			momentum += consumedMomentum;
		} else {
			momentum -= consumedMomentum;
		}

		movement.setLength(Math.max(useableMomentum / mass, 0));

		position.set(x, y);

		var particle = new Particle(position, movement, mass);

		addParticle(particle);
		sand.remove(position.x, position.y, grain);

		return momentum;
	},

	suggestDeath: function(duration) {
		if (this.mass <= 0) {
			// the particle has no mass anymore, DBA
			this.alive = false;
			return true;
		}

		if (this.stuckDuration > 0.25) {
			// the particle is stuck, that happens sometimes
			return this.kill();
		}

		if (sand.get(this.position.x, this.position.y + 1) <= THRESHOLD) {
			// there is no sand below the particle
			return false;
		}

		if (this.movement.length() > G * duration) {
			// the particle has too much speed, it won't rest here
			return false;
		}

		// safe to kill
		return this.kill();
	},

	kill: function() {
		// HELLO. PLEASE, FOLLOW ME...
		sand.add(this.position.x, this.position.y, this.mass);
		this.alive = false;

		return true;
	},

	draw: function(context) {
		context.save();
		context.translate(this.position.x, this.position.y);

		if (DRAW_MOVEMENT) {
			// draw movement
			context.strokeStyle = "#aaaaff";
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(this.movement.x, - this.movement.y);
			context.stroke();
		}

		var scale = Math.max(this.radius(), 0.7) / PARTICLE_RADIUS;
		context.scale(scale, scale);
		context.rotate(this.rotation);
		context.drawImage(images.particle, - PARTICLE_RADIUS, - PARTICLE_RADIUS);
		context.restore();
	}
};
