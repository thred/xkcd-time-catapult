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

define("Button", [], function() {
	function Button(name, values, selectedIndex, handler) {
		this.name = name;
		this.values = values;
		this.selectedIndex = selectedIndex || 0;
		this.handler = handler;

		this.update();
	}

	Button.prototype = {
		click: function() {
			this.selectedIndex += 1;
			this.selectedIndex %= this.values.length;
			this.update();

			if (this.handler) {
				this.handler(this.value());
			}
		},

		update: function() {
			var element = document.getElementById(this.name);

			if (!element) {
				return;
			}

			element.src = this.values[this.selectedIndex].src;
		},

		value: function() {
			return this.values[this.selectedIndex].value;
		}
	};

	return Button;
});