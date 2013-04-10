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

define("Catapult", ["Global", "Vector"], function(Global, Vector) {

	function Catapult() {
		this.particles = [];
		this.position = new Vector();
		this.theta = -Math.PI / 3;
	}

	Catapult.prototype = {

		constructor: Catapult,

		draw: function(context) {
			context.save();
			context.translate(this.position.x, this.position.y);
			context.drawImage(Global.IMAGES.catapult, - 24, - 24);
			context.rotate(this.theta);
			context.drawImage(Global.IMAGES.arm, - 14, - 3);
			context.restore();
		}

	};

	return Catapult;
});