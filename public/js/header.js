// JS Header insert

class Header extends HTMLElement {
	constructor() {
		super();
	}
	
	connectedCallback() {
		this.innerHTML = `
			<style>
			/* Style the header (same as before) */
			header {
				background-color: #333;
				color: #fff;
				padding: 10px;
			}

			nav ul {
				list-style-type: none;
				padding: 0;
				text-align: center;
			}

			nav ul li {
				display: inline;
				margin: 0 10px;
			}

			nav ul li a {
				text-decoration: none;
				color: #fff;
				font-weight: bold;
			}
			</style>
			<header>
				<nav>
					<ul>
						<li><a href="/">Schedule</a></li>
						<li><a href="editdata.html">Edit Data</a></li>
						<li><a href="export.html">Export</a></li>
						<li><a href="schedule.html">Corrections</a></li>
					</ul>
				</nav>
			</header>
		`;
	}
}

customElements.define('header-component', Header);
