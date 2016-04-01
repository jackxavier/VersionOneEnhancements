/**
 * Created by snake on 27.03.16.
 */
// Saves options to chrome.storage
function save_options() {
	var options = {
		replaceTinyMCE: document.getElementById('replaceTinyMCE').checked,
		minHeightTinyMCE: +document.getElementById('minHeightTinyMCE').value,
		maxHeightTinyMCE: +document.getElementById('maxHeightTinyMCE').value,
		typography: document.getElementById('typography').checked,
		expand: document.getElementById('expand').checked,
		myWorkEnhancement: document.getElementById('myWorkEnhancement').checked
	};
	chrome.storage.sync.set(options, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		replaceTinyMCE: true,
		minHeightTinyMCE: 200,
		maxHeightTinyMCE: 0,
		typography: true,
		expand: true,
		myWorkEnhancement: true
	}, function(items) {
		document.getElementById('replaceTinyMCE').checked = items.replaceTinyMCE;
		document.getElementById('minHeightTinyMCE').value = items.minHeightTinyMCE;
		document.getElementById('maxHeightTinyMCE').value = items.maxHeightTinyMCE;
		document.getElementById('typography').checked = items.typography;
		document.getElementById('expand').checked = items.expand;
		document.getElementById('myWorkEnhancement').checked = items.myWorkEnhancement;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);