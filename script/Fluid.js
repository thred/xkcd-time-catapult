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
 *
 * The algorithm is based on http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
 */

var Fluid = function(n) {

		this.n = n;
		this.size = n * n;
		this.realN = n + 2;
		this.realSize = this.realN * this.realN;

		this.u = new Array(this.realSize);
		this.v = new Array(this.realSize);
		this.u_prev = new Array(this.realSize);
		this.v_prev = new Array(this.realSize);
		this.dens = new Array(this.realSize);
		this.dens_prev = new Array(this.realSize);
	};

Fluid.prototype = {

	get: function(array, x, y) {
		return array[x + y * this.realN];
	},

	set: function(array, x, y, value) {
		array[x + y * this.realN] = value;
	},

	/**
	 * Adds a source
	 * 
	 * @param array the array
	 * @param sources an array of sources
	 * @param duration the duration
	 */
	addSource: function(array, sources, duration) {
		for (var i = 0; i < this.realSize; i += 1) {
			array[i] += duration * sources[i];
		}
	},

	diffuse: function(b, array, array0, diff, duration) {
		var a = duration * diff * this.n * this.n;

		for (var k = 0; k < 20; k += 1) {
			for (var x = 1; x <= this.n; x += 1) {
				for (var y = 1; y <= this.n; y += 1) {
					this.set(array, x, y, this.get(array0, x, y) + a * (this.get(array, x - 1, y) + this.get(array, x + 1, y) + this.get(array, x, y - 1) + this.get(array, x, y + 1)) / (1 + 4 * a));
				}
			}

			this.setBnd(b, array);
		}
	},

	advect: function(b, d, d0, u, v, dt) {
		var dt0 = dt * this.n; // or height or something else

		for (var i = 1; i <= this.n; i += 1) {
			for (var j = 1; j <= this.n; j += 1) {
				var x = i - dt0 * this.get(u, i, j);
				var y = j - dt0 * this.get(v, i, j);

				if (x < 0.5) x = 0.5;
				if (x > this.n + 0.5) x = this.n + 0.5;

				var i0 = parseInt(x, 10);
				var i1 = i0 + 1;

				if (y < 0.5) y = 0.5;
				if (y > this.n + 0.5) y = this.n + 0.5;

				var j0 = parseInt(y, 10);
				var j1 = j0 + 1;

				var s1 = x - i0;
				var s0 = 1 - s1;
				var t1 = y - j0;
				var t0 = 1 - t1;

				this.set(d, i, j, s0 * (t0 * this.get(d0, i0, j0) + t1 * this.get(d0, i0, j1)) + s1 * (t0 * this.get(d0, i1, j0) + t1 * this.get(d0, i1, j1)));
			}
		}

		this.setBnd(b, d);
	},

	densStep: function(x, x0, u, v, diff, dt) {
		this.addSource(x, x0, dt);

		// huh?
		var tmp = x0;
		x0 = x;
		x = tmp;

		this.diffuse(0, x, x0, diff, dt);

		// huh?
		tmp = x0;
		x0 = x;
		x = tmp;

		this.advect(0, x, x0, u, v, dt);
	},

	velStep: function(u, v, u0, v0, visc, dt) {
		this.addSource(u, u0, dt);

		// huh?
		var tmp = u0;
		u0 = u;
		u = tmp;

		this.diffuse(1, u, u0, visc, dt);

		// huh?
		tmp = v0;
		v0 = v;
		v = tmp;

		this.diffuse(2, v, v0, visc, dt);

		this.project(u, v, u0, v0);

		// huh?
		tmp = u0;
		u0 = u;
		u = tmp;

		// huh?
		tmp = v0;
		v0 = v;
		v = tmp;

		this.advect(1, u, u0, u0, v0, dt);
		this.advect(2, v, v0, u0, v0, dt);

		this.project(u, v, u0, v0);
	},

	project: function(u, v, p, div) {
		var h = 1.0 / this.n;
		for (var i = 1; i <= this.n; i++) {
			for (var j = 1; j <= this.n; j++) {
				this.set(div, i, j, - 0.5 * h * (this.get(u, i + 1, j) - this.get(u, i - 1, j) + this.get(v, i, j + 1) - this.get(v, i, j - 1)));
				this.set(p, i, j, 0);
			}
		}

		this.setBnd(0, div);
		this.setBnd(0, p);

		for (var k = 0; k < 20; k++) {
			for (var i = 1; i <= this.n; i++) {
				for (var j = 1; j <= this.n; j++) {
					this.set(p, i, j, (this.get(div, i, j) + this.get(p, i - 1, j) + this.get(p, i + 1, j) + this.get(p, i, j - 1) + this.get(p, i, j + 1)) / 4);
				}
			}

			this.setBnd(0, p);
		}

		for (var i = 1; i <= this.n; i++) {
			for (var j = 1; j <= this.n; j++) {
				this.set(u, i, j, this.get(u, i, j) - 0.5 * (this.get(p, i + 1, j) - this.get(p, i - 1, j)) / h);
				this.set(v, i, j, this.get(v, i, j) - 0.5 * (this.get(p, i, j + 1) - this.get(p, i, j - 1)) / h);
			}
		}

		this.setBnd(1, u);
		this.setBnd(2, v);
	},

	setBnd: function(b, x) {
		for (var i = 1; i <= this.n; i++) {
			this.set(x, 0, i, (b == 1) ? -this.get(x, 1, i) : this.get(x, 1, i));
			this.set(x, this.n + 1, i, b == 1 ? -this.get(x, this.n, i) : this.get(x, this.n, i));
			this.set(x, i, 0, b == 2 ? -this.get(x, i, 1) : this.get(x, i, 1));
			this.set(x, i, this.n + 1, b == 2 ? -this.get(x, i, this.n) : this.get(x, i, this.n));
		}

		this.set(x, 0, 0, 0.5 * (this.get(x, 1, 0) + this.get(x, 0, 1)));
		this.set(x, 0, this.n + 1, 0.5 * (this.get(x, 1, this.n + 1) + this.get(x, 0, this.n)));
		this.set(x, this.n + 1, 0, 0.5 * (this.get(x, this.n, 0) + this.get(x, this.n + 1, 1)));
		this.set(x, this.n + 1, this.n + 1, 0.5 * (this.get(x, this.n, this.n + 1) + this.get(x, this.n + 1, this.n)));
	},

	simulate: function(duration) {
		//get_from_UI ( dens_prev, u_prev, v_prev );
		this.velStep(this.u, this.v, this.uPrev, this.vPrev, this.visc, duration);
		this.densStep(this.dens, this.dens_prev, this.u, this.v, this.diff, duration);
		//draw_dens ( N, dens );
	}

};