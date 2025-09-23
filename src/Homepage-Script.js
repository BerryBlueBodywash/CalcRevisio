    function switchTab(tabId) {
      document.querySelectorAll('.lesson-flow').forEach(tab => tab.classList.add('hidden'));
      document.getElementById(tabId).classList.remove('hidden');
    }
