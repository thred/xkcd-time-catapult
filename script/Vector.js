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

define("Vector", [], function() {

	function Vector(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	Vector.prototype = {

		constructor: Vector,

		set: function(x, y) {
			this.x = x;
			this.y = y;

			return this;
		},

		add: function(x, y) {
			this.x += x;
			this.y += y;

			return this;
		},

		sub: function(x, y) {
			this.x -= x;
			this.y -= y;

			return this;
		},

		multiplyScalar: function(s) {
			this.x *= s;
			this.y *= s;

			return this;
		},

		divideScalar: function(s) {
			if (s !== 0) {
				this.x /= s;
				this.y /= s;
			} else {
				this.set(0, 0);
			}

			return this;
		},

		direction: function() {
			var v = this.clone().normalize();
			var result = Math.atan(v.y / v.x);

			if (v.x < 0) {
				result += Math.PI;
			}

			return result;
		},

		setDirection: function(direction, length) {
			this.x = Math.cos(direction) * length;
			this.y = -Math.sin(direction) * length;

			return this;
		},

		length: function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},

		setLength: function(l) {
			var oldLength = this.length();

			if (oldLength !== 0 && l !== oldLength) {
				this.multiplyScalar(l / oldLength);
			}

			return this;
		},

		mirror: function(normal) {
			// mirror the movement of the particle along the normalized normal 
			var vx = this.x;
			var vy = this.y;
			var dotprod = -vx * normal.x - vy * normal.y;

			this.x = vx + 2 * normal.x * dotprod;
			this.y = vy + 2 * normal.y * dotprod;

			return this;
		},

		normalize: function() {
			return this.divideScalar(this.length());
		},

		dot: function(v) {
			return this.x * v.x + this.y * v.y;
		},

		clone: function() {
			return new Vector(this.x, this.y);
		}

	};

	return Vector;
});