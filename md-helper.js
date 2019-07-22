const PathHelper = require("./path-helper");



class MdHelper {

}

MdHelper.liveCoding = function (marked) {

    marked.InlineLexer.prototype.oldToken = marked.InlineLexer.prototype.token;
    marked.Lexer.prototype.oldToken = marked.Lexer.prototype.token;

    marked.InlineLexer.prototype.token = function () {

        this.rules.code = /^(`+)\s*([\s\S]*?(?:\sshowroom)?[^`])\s*\1(?!`)/g;
        return this.oldToken(arguments[0]);
    };

    marked.Lexer.prototype.token = function () {
        this.rules.fences = /^ *(`{3,}|~{3,})[ \.]*(\S+(?:\sshowroom)?)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/;
        return this.oldToken(arguments[0], arguments[1], arguments[2]);
    };


    /* surcharge fonction du module marked */
    function escape(html, encode) {

        return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    marked.Renderer.oldCode = marked.Renderer.code;
    marked.Renderer.prototype.oldcode = marked.Renderer.prototype.code;
    marked.Renderer.prototype.code = function (code, lang, escaped) {

        if (lang == "javascript showroom") {
            return '<pre class="container-code"><code class="' +
                escape(lang, true) +
                '">' +
                escape(code, true) +
                '\n</code></pre>\n';
        } else {
            if (this.options.highlight) {
                const out = this.options.highlight(code, lang);
                if (out != null && out !== code) {
                    escaped = true;
                    code = out;
                }
            }

            if (!lang) {
                return '<pre><button class="copy-code-button">Copier</button><code>' +
                    (escaped ? code : escape(code, true)) +
                    '\n</code></pre>';
            }

            return '<pre><button class="copy-code-button">Copier</button><code class="' +
                this.options.langPrefix +
                escape(lang, true) +
                '">' +
                (escaped ? code : escape(code, true)) +
                '\n</code></pre>\n';
        }
    };
}




/**
 * SURCHARGE
 * Reformate les liens présents dans le md si celui pointe vers
 * un autre ".md"
 */
MdHelper.mdLink = function (marked) {
    marked.Renderer.prototype.link = function (href, title, text) {

        const rgx = new RegExp(/(^[\.])([\W\w]+)(\.md$)/, "g");

        if (rgx.test(href)) {
            href = PathHelper.cleanName(href.split(".md")[0]);
        }

        let out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };
}


/**
 * SURCHARGE
 * modification Id des balise h
 */
MdHelper.htmlTitle = function (marked) {
    let idcpt = 0;
    marked.Renderer.prototype.heading = function (text, level, raw) {

        return '<h' +
            level +
            ' id="' +
            this.options.headerPrefix +
            raw.toLowerCase().replace(/[^\w]+/g, '-') + "-" + idcpt++ +
            '">' +
            text +
            '</h' +
            level +
            '>\n';
    };

}

MdHelper.htmlTable = function (marked) {

    marked.Renderer.prototype.table = function (header, body) {
        return '<table class="showroom-table">\n' +
            '<thead>\n' +
            header +
            '</thead>\n' +
            '<tbody>\n' +
            body +
            '</tbody>\n' +
            '</table>\n';
    };
}


MdHelper.highlight = function (marked, hljs) {

    marked.setOptions({
        highlight: function (code, lang) {
            if (typeof lang === "undefined") {
                return hljs.highlightAuto(code).value;
            } else if (lang === "nohighlight" || lang === "sass" || lang === "mermaid" ) {
                return code;
            } else {
                return hljs.highlight(lang, code).value;
            }

        }
    });
}

module.exports = MdHelper;