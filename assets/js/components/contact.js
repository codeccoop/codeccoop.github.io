function ContactForm($el) {
    var self = this;
    this.fields = Array.apply(null, $el.getElementsByClassName("contact__field"));
    this.fields.forEach(function(el) {
        Object.defineProperty(el, "warn", {
            set: function(message) {
                var input = el.getElementsByTagName("input")[0] || el.getElementsByTagName("textarea")[0];
                var help = el.getElementsByClassName("help")[0];
                if (!message) {
                    input.classList.remove("is-warning");
                    help.classList.remove("is-warning");
                    help.innerText = "";
                } else {
                    input.classList.add("is-warning");
                    help.classList.add("is-warning");
                    input.classList.remove("is-success");
                    help.classList.remove("is-success");
                    help.innerText = message;
                }
            }
        });

        Object.defineProperty(el, "success", {
            set: function(message) {
                var input = el.getElementsByTagName("input")[0] || el.getElementsByTagName("textarea")[0];
                var help = el.getElementsByClassName("help")[0];
                if (!message) {
                    help.classList.remove("is-success");
                    help.innerText = "";
                } else {
                    input.classList.add("is-success");
                    help.classList.add("is-success");
                    input.classList.remove("is-warning");
                    help.classList.remove("is-warning");
                    help.innerText = message;
                }
            }
        });
    });

    this.inputs = this.fields.map(function(el) {
        return Array.apply(null, el.getElementsByTagName("input"))
            .concat(Array.apply(null, el.getElementsByTagName("textarea")));
    });

    this.submitBtn = $el.getElementsByClassName("contact__submit-field")[0]
        .getElementsByTagName("button")[0];

    this.submit = this.submit.bind(this);
    this.onSent = this.onSent.bind(this);
    this.submitBtn.addEventListener("click", function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        self.submit(ev)
            .then(self.onSent)
            .catch(function(err) {
                console.error(err);
            });
    });

    for (var i = 0; i < this.inputs.length; i++) {
        for (var j = 0; j < this.inputs[i].length; j++) {
            var input = this.inputs[i][j];
            switch (input.type) {
                case "text":
                    this.bindText(input, i);
                    break;
                case "email":
                    this.bindEmail(input, i);
                    break;
                case "radio":
                    this.bindRadio(input, i);
                    break;
                case "checkbox":
                    this.bindCheckbox(input, i);
                    break;
                default:
                    this.bindText(input, i);
            }
        }
    }

    Object.defineProperty(this, "values", {
        get: function() {
            return self.fields.reduce(function(acum, el, i) {
                acum[el.id.replace(/^contact/, "").toLowerCase()] = {
                    value: el._value,
                    required: el.hasAttribute("required")
                };
                return acum;
            }, {});

        }
    });

    this.notification = $el.getElementsByClassName("contact__notification")[0];
    this.notification.getElementsByClassName("delete")[0].addEventListener("click", function() {
        self.notification.classList.add("is-hidden");
    });
}

ContactForm.prototype.bindInput = function(input, fieldIdx, callback) {
    var self = this;

    function onInput(ev) {
        var field = self.fields[fieldIdx];
        try {
            field.warn = null;
            field._value = callback(ev);
        } catch (err) {
            field.warn = err.message;
        }
    }

    input.addEventListener("input", onInput);
}

ContactForm.prototype.bindText = function(input, fieldIdx) {
    var self = this;
    this.bindInput(input, fieldIdx, function() {
        if (input.value === "" && self.fields[fieldIdx].hasAttribute("required")) {
            throw new Error("Aquest camp és obligatori");
        }
        return input.value
    });
}

ContactForm.prototype.bindEmail = function(input, fieldIdx) {
    var self = this;
    var validationRe = /^[a-zA-Z0-9\.]+@[a-zA-Z0-9_\.]+?\.(?=[a-zA-Z]+)[a-zA-Z]{2,}$/;
    this.bindInput(input, fieldIdx, function() {
        var field = self.fields[fieldIdx];
        if (!input.value.match(validationRe)) {
            field.success = null;
            throw new Error("Correu electrònic no vàlid");
        } else if (input.value === "") {
            field.success = null;
            throw new Error("Aquest camp és obligatori");
        }

        field.success = "Correu electrònic validat";
        return input.value;
    });
}

ContactForm.prototype.bindCheckbox = function(input, fieldIdx) {
    var self = this;
    this.bindInput(input, fieldIdx, function() {
        var field = self.fields[fieldIdx]
        if (field._value && !input.checked && field.hasAttribute("required")) {
            throw new Error("Aquest camp és obligatori");
        }

        return input.checked;
    });
}

ContactForm.prototype.bindRadio = function(input, fieldIdx) {
    var self = this;
    this.bindInput(input, fieldIdx, function() {
        return input.value === "true" || input.value === "1";
    });
}

ContactForm.prototype.submit = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var self = this;
    var values = this.values;

    return new Promise(function(res, rej) {
        var isFullfilled = Object.keys(values).reduce(function(isFullfilled, key) {
            var isValid = (values[key].value !== void 0 && values[key].value !== "") || values[key].required !== true;
            if (!isValid) {
                var field = self.fields.find(function(el) {
                    return el.id === "contact" + key[0].toUpperCase() + key.slice(1);
                });
                field.warn = "Aquest camp és obligatori";
            }

            return isFullfilled && isValid;
        }, true);

        if (isFullfilled) {
            var form = Object.keys(values).map(function(key) {
                var value = values[key].value === true ? 1 : values[key].value === false ? 0 : values[key].value;
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }).join("&");

            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        res(JSON.parse(this.responseText));
                    } else {
                        rej({
                            status: this.status,
                            text: this.responseText
                        });
                    }
                }
            }

            req.onerror = function() {
                rej({
                    status: this.status,
                    text: this.responseText
                });
            }

            req.open("POST", "https://codeccoop.org/api/email_form.php");
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            req.setRequestHeader("Accept", "application/json");
            req.send(form);
        } else {
            rej("Not fullfilled");
        }
    });
}

ContactForm.prototype.onSent = function(res) {
    if (res.success) {
        this.inputs.forEach(function(inputs) {
            inputs.forEach(function(input) {
                input.value = "";
                input.checked = false;
            });
        });
        this.notification.classList.remove("is-hidden");
    }
}
