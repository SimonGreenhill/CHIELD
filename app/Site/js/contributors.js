// Documents

dtableConfig =  {
		ordering: true,
        lengthChange: false,
        order: [[ 1, "desc" ]],
        //scrollY: '50vh',
        //scrollCollapse: true,
        pageLength: 8,

        columns: [
        	// Combine the reference and the citekey to make a link
        	{ data: null, render: function(data,type,row){
                var username = data[0];
                var realname = data[1];
                if(username.length>0){
        		  return('<a href="https://github.com/' + username +'">'+realname + '</a>');
                } else{
                    return(realname)
                }
        	}},
        	{data: 2}
        	]
 	 	};


$(document).ready(function(){
	preparePage("contributors_table","php/getContributors.php");
    requestLinks(php_link);
});