;(function ($) {
	
	var Result = Backbone.View.extend({
		
		update: function (from, to, prefix) {
			
			var result = this.sql_query;
			
			result = result.replace(/SITEA/g, from);
			result = result.replace(/SITEB/g, to);
			
			if (prefix != 'wp_') {
				result = result.replace(/wp\_/g, prefix);
			}
			
			this.$el.html(result);
			prettyPrint();
			
		},
		
		sql_query: "UPDATE wp_options SET option_value = replace(option_value, 'SITEA', 'SITEB') WHERE option_name = 'home' OR option_name = 'siteurl';\nUPDATE wp_posts SET guid = replace(guid, 'SITEA','SITEB');\nUPDATE wp_posts SET post_content = replace(post_content, 'SITEA', 'SITEB');\nUPDATE wp_postmeta SET meta_value = replace(meta_value, 'SITEA', 'SITEB');"
			
	});
	
	var App = Backbone.View.extend({
		
		events: {
			
			'submit form': 	'generate'		
			
		},
		
		initialize: function () {
			
			_.bindAll(this, 'generate');
			
			this.$form = this.$('form');
			
			this.$inp_from = this.$('#inputFrom');
			this.$inp_to = this.$('#inputTo');
			this.$inp_prefix = this.$('#inputPrefix');
			
			
			this.result = new Result( {el: '#result'} );
			
			//console.log(this.$form);
			
			//DEBUG
			
			this.$inp_from.val('g100g.local/first/second/third/');
			this.$inp_to.val('g100g.net/first//');
			
			//this.$inp_from.val('http://g100g.local/first/second/third/');
			//this.$inp_to.val('http://g100g.net/first//');
		},
		
		/**
		
			Check for http
			
		**/
		
		addHttp: function (str) {
			
			if (!/^http(s?):\/\//.test(str)) {
				
				return 'http://'+str;
				
			}
			
			return str; 	
			
		},
		
		/**
		
			Simple trim
			
		**/
		
		trim : function(str){
			return str.replace(/^\s+|\s+$/g, '');
			//Thanks to http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
		},
		
		/**
		
			Remove trailing slash
			
		**/
		
		removeSlash: function (str) {
			
			return str.replace(/\/+$/g, '');
			
		},
		
		checkPrefix: function (prefix) {

			if (prefix == '') {
				
				return '';
				
			}
			
			prefix += "_";
			
			return prefix.replace(/_+$/g, '_');
			
		},
		
		generate: function (e) {
		
			var from = this.trim( this.$inp_from.val() ),
				to = this.trim( this.$inp_to.val() ),
 				prefix = this.trim( this.$inp_prefix.val() );
			
			e.preventDefault();
			
			//Add http:// to urls
			from = this.addHttp(from);
			this.$inp_from.val(from);
			to = this.addHttp(to);
			this.$inp_to.val(to);
			
			//Remove last trailing slash from url
			from = this.removeSlash(from);
			this.$inp_from.val(from);
			
			to = this.removeSlash(to);
			this.$inp_to.val(to);
			
			
			//Check prefix
			prefix = this.checkPrefix(prefix);
			this.$inp_prefix.val(prefix);
			
			//Build SQL query
			this.result.update( from, to, prefix );
			
		},
		
		
		
	});
	
	$(function () {
		
		var app = new App({ el: '#app' });
		
	});
	
})(jQuery);
