(function () {
	var _scope = null;
	
	var _options = JSON.parse(document.querySelector('body').dataset.options);
	var EJS_URL = _options.baseUrl + 'dependencies/ejs/ejs.min.js';

	_init();
	window.addEventListener('load', _init);
	document.addEventListener('voe.gridRendered', _init);

	function _init() {
		_scope = document.querySelector('.IterationTracking_DetailTracking_Grid, .TeamRoom_ListView, .WorkitemPlanning_TaskTestList_Grid');
		if (!_scope) { return; }

		var appendButtons = _scope.classList.contains('WorkitemPlanning_TaskTestList_Grid') ? _appendBacklogCopyButtons : _appendTeamsCopyButtons
		if (!document.querySelector('link[href*="copyListOfStories/styles.css"]')) {
			injectStyle(_options.componentsUrl + 'copyListOfStories/styles.css', appendButtons);
		} else {
			appendButtons();
		}
	}

	function _appendTeamsCopyButtons() {
		if (document.querySelector('.voe-btn')) { return; }

		var filters = _scope.querySelector('.filters');
		var copyForReleaseBtn = _createButton('Copy For Release');
		var copyForReviewBtn = _createButton('Copy For Review');

		filters.appendChild(copyForReleaseBtn);
		filters.appendChild(copyForReviewBtn);

		copyForReleaseBtn.addEventListener('click', function(event) {
			_handleButton('release');

			event.preventDefault();
		});
		copyForReviewBtn.addEventListener('click', function(event) {
			_handleButton('review');

			event.preventDefault();
		});
	}
	
	function _appendBacklogCopyButtons() {
		if (document.querySelector('.voe-btn')) { return; }

		var filters = _scope.querySelector('.filters');
		var copyBacklogBtn = _createButton('Copy Backlog');

		filters.appendChild(copyBacklogBtn);

		copyBacklogBtn.addEventListener('click', function(event) {
			_handleButton('backlog');
			event.preventDefault();
		});
		
	}

	function _createButton(text) {
		var button = document.createElement('div');

		button.classList.add('grid-row-btn');
		button.classList.add('voe-btn');
		button.innerText = text;

		return button;
	}

	function _handleButton(type) {
		var team = _getTeam();
		var assets = _getAssetsData().map(function(asset) {
			asset.team = team;

			return asset;
		});
		var template = _options['templateFor' + _capitalizeFirstLetter(type)];
		if (!document.querySelector('script[src="' + EJS_URL + '"]')) {
			injectScript(EJS_URL, function() {
				_copyToClipboard(_generateReport({ team: team, assets: assets }, template));
			});
		} else {
			_copyToClipboard(_generateReport({ team: team, assets: assets }, template));
		}
	}

	function _capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function _generateReport(data, template) {
		return ejs.render(template, data);
	}

	function _getAssetsData() {
		var data = [];

		document.querySelectorAll('.gridtable .nest-0').forEach(function(row) {
			data.push(_parseAsset(row));
		});

		return data;
	}

	function _parseAsset(row) {
		var assetNameLink = row.querySelector('.asset-name-link');
		var assetNumberLink = row.querySelector('.asset-number-link');
		var owners = _findByName('Owner', row);
		var status = _findByName('Status', row);
		var points = _findByName('Estimate Pts.', row);
		var priority = _findByName('Priority', row);
		var epic = _findByName('Epic', row);

		return {
			id: assetNumberLink ? assetNumberLink.innerText : '',
			type: row.getAttribute('_v1_type').toLowerCase(),
			name: assetNameLink ? assetNameLink.innerText : '',
			link: assetNameLink ? document.location.origin + assetNameLink.getAttribute('href') : '',
			owners: owners ? _parseOwners(owners) : [],
			status: status ? _parseStatus(status) : '',
			points: points ? parseFloat(points.innerText) : null,
			priority: priority ? priority.innerText.trim() : '',
			epic: epic ? epic.innerText : '',
		}
	}

	function _parseStatus(statusElement) {
		if (statusElement.querySelector('.dropdown')) {
			return statusElement.querySelector('.ddtext').innerText.trim();
		}

		return statusElement.innerText.trim();
	}

	function _parseOwners(ownersElement) {
		var owners = [];

		if (ownersElement.querySelector('.items')) {
			owners = Array.prototype.map.call(ownersElement.querySelectorAll('.item'), function(owner) {
				return owner.innerText;
			});
		} else if (ownersElement.innerText.trim()) {
			owners = ownersElement.innerText.split(',').map(v => v.trim());
		}

		return owners;
	}

	function _findByName(name, row) {
		var tableHead = row.closest('table').querySelector('thead');
		var header = tableHead.querySelector('[title*="' + name + '"]');

		if (!header) { return null; }

		return row.children[_getIndex(header)];
	}

	function _getIndex(element) {
		var i = 0;

		while((element = element.previousSibling) != null) {
			i++;
		}

		return i;
	}

	function _getTeam() {
		var h1 = document.querySelector('[data-assettype="TeamRoom"]');
		var select = document.querySelector('select[_v1_updater*="Team"]');

		if (h1) {
			return h1.innerText;
		}

		if (select) {
			var selectedIndex = select.selectedIndex;

			return select.options[selectedIndex].innerText;
		}

		return '';
	}

	function _copyToClipboard(str) {
		var element = document.createElement('textarea');

		element.value = str;
		element.setAttribute('readonly', '');
		element.style.position = 'absolute';
		element.style.left = '-9999px';
		document.body.appendChild(element);
		element.select();
		document.execCommand('copy');
		document.body.removeChild(element);
	}
}());