---
layout: none
---

{% capture scripts %}
	{% include_relative utils/device-detect.js %}
	{% include_relative utils/SectionScroller.js %}
	{% include_relative utils/easees.js %}
	{% include_relative utils/viewport.js %}

    document.addEventListener("DOMContentLoaded", function () {
	    {% include_relative main.js %}
		{% include_relative utils/loader.js %}

		{% include_relative components/header.js %}
		{% include_relative components/contact.js %}
		{% include_relative components/footer.js %}
	});
{% endcapture %}

{{ scripts | uglify | strip }}
