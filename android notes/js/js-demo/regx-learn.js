var linkStr = "<tr class=\"tr3\">\n" +
    "<td class=\"icon tar\" width=\"30\">\n" +
    "<a title=\"��������\" href=\"read.php?tid=63\" target=\"_blank\">\n" +
    "<img src=\"images/wind/thread/topicnew.gif\" align=\"absmiddle\">\n" +
    "</a>\n" +
    "</td>\n" +
    "<td class=\"subject\" id=\"td_63\">\n" +
    "\n" +
    "<a href=\"read.php?tid=63\" name=\"readlink\" id=\"a_ajax_63\" class=\"subject_t f14\">������--68</a>&nbsp;\n" +
    "<span class=\"s2 w\"></span>\n" +
    "</td>\n" +
    "<td class=\"author\">\n" +
    "<a href=\"u.php?uid=1\" class=\" _cardshow\" data-card-url=\"pw_ajax.php?action=smallcard&type=showcard&uid=1\" target=\"_blank\"\n" +
    " data-card-key=\"admin\">admin</a>\n" +
    "<p>2018-02-24</p>\n" +
    "</td>\n" +
    "<td class=\"num\" width=\"60\">\n" +
    "<em>0</em>/12</td>\n" +
    "<td class=\"author\">\n" +
    "<a href=\"u.php?username=admin\" target=\"_blank\" class=\" _cardshow\" data-card-url=\"pw_ajax.php?action=smallcard&type=showcard&username=admin\"\n" +
    " data-card-key=\"admin\">admin</a>\n" +
    "<p>\n" +
    "<a href=\"read.php?tid=63&page=e#a\" title=\"2018-02-24 09:21\">02-24</a>\n" +
    "</p>\n" +
    "</td>\n" +
    "</tr>";

var linkRegx = "tid";
var group = linkStr.match(linkRegx);
console.log(group);  


var myRe = /"tid=63"/;
var myArray = myRe.exec(linkStr);
console.log(myArray);  