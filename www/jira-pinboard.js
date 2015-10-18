(function () {
    "use strict";

    function loadTemplate(path) {
        return $.get(path).then(function (tpl) {
            return _.template(tpl);
        });
    }

    function boardRenderer(issues, cardTpl) {
        var el = $("<div />").addClass("pinboard");

        function renderCard(issue) {
            return $(cardTpl({
                key: issue.key,
                points: issue.estimateStatistic &&
                    issue.estimateStatistic.statFieldValue &&
                    issue.estimateStatistic.statFieldValue.text,
                summary: issue.summary,
                epic: issue.epicField && issue.epicField.text,
                epicClass: issue.epicField && issue.epicField.epicColor
            }));
        }

        return {
            render: function () {
                issues.forEach(function (issue) {
                    el.append(renderCard(issue));
                });

                return el;
            }
        }
    }

    var issues = {
        url: "/fetch-board",
        fetch: function () {
            return $.get(this.url)
                .then(function (data) {
                    return data.issuesData.issues;
                });
        }
    };

    var boardView = {
        issues: null,
        cardTpl: null,

        render: function () {
            boardRenderer(this.issues, this.cardTpl)
                .render()
                .appendTo(document.body);
        },

        renderError: function (e) {
            var msg = e.responseJSON && e.responseJSON.error || e.responseText;

            $('<div />')
                .addClass('error')
                .text(msg)
                .appendTo(document.body);
        },

        hideLoader: function () {
            $('.loader').hide();
        }
    };

    $.when(
        loadTemplate('card-template.html'),
        issues.fetch()
    ).done(function (tpl, issues) {
        boardView.cardTpl = tpl;
        boardView.issues = issues;
        boardView.render();
    })
    .fail(function (e) {
        boardView.renderError(e);
    })
    .always(function () {
        boardView.hideLoader();
    });
})();
