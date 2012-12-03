// jQuery plugin to show and move a marker over a horizontal timeline depending on the content viewed at the moment.
// This plugin is specificly created for this template. Feel free to use it elsewhere, but several modifications might be needed to get it to work in other applications
// MIT Licensed
(function ($)
{
	$.extend($.fn, {
	    timeline: function (options) {
                // Declare variables
				var engagements = [];
				var span;
				var totalMonthCount = 0;
				var pxPerMonth;
				
                // Search DOM for engagement with attribute 'timeline'
				$.each($(this).find('[data-timeline]'), function(index, domElement){
				    var ms = new Engagement(domElement);
					totalMonthCount += ms.monthSpan;
					engagements.push(ms);					
				});

                // If there are no engagements, return
				if (engagements.length == 0)
				    return;
				
                // Since the dom is searched from up side and down this isn't really necessary, but it sorts the array descending according to engagement dates 
				engagements = engagements.sort(function(a,b){
					return a.scrollTop - b.scrollTop
				});
				
	            // Calculate the number of horizontal pixels represented by a month. 
				// 792 is the total width of the timeline which the markup engagemnt are allowed to allocate. 
				pxPerMonth = parseFloat(792/totalMonthCount);
				
                // Create and append the present marker to the timeline
				this.$mileStoneMarker = $('<div></div>');
				$('.timeline .startStop .line').append(this.$mileStoneMarker);
				this.$mileStoneMarker.addClass('engagementMarker odd');
				this.$mileStoneMarker.append('<a href="#present" class="milestoneLink">Present</a>');
				this.$mileStoneMarker.css('margin-right', parseInt(55));
				
                // Append the timeline with points where the different engagements in the timeline starts.
				var even = true;
				$.each(engagements, function(index, milestone){
					
					this.$mileStoneMarker = $('<div></div>');
					$('.timeline .startStop .line').append(this.$mileStoneMarker);
					if(even){
					    this.$mileStoneMarker.addClass('engagementMarker even');
					}
					else{
					    this.$mileStoneMarker.addClass('engagementMarker odd');
					}
					this.$mileStoneMarker.append('<a href="#' + milestone.label + '" class="milestoneLink">' + milestone.startYear + '-' + milestone.startMonth + '</a>');
					milestone.marginRight = parseInt(milestone.monthSpan * pxPerMonth-53);
					this.$mileStoneMarker.css('margin-right', milestone.marginRight);
					
					even = !even;
				});
				
                // Calculate the total vertical span of the engaments.				
				span = engagements[engagements.length - 1].scrollTop;
				
	            // Scroll event. 
				//The callback function of the scroll event looks at the documents offset to the top and calcultaes the timelines marker position by its offset 
				//from the right edge of the timeline.
				$(window).scroll(function () {
                    var scrollPos = $(document).scrollTop();					
					var markerPos = 0;
					var totalScrollDist = 0;
					var relativeScrollDist = 0;
					var moveRightDist = 0;
					var summedMarginRight = 53+55;
					
					if(scrollPos < engagements[0].scrollTop){
					    markerPos = parseInt((scrollPos / engagements[0].scrollTop) * (engagements[0].marginRight + 53+55));
						markerPos = Math.min(885, markerPos);
						$('.timeMarker').css('margin-right', markerPos);
					}
					
					$.each(engagements, function(index, milestone){
						if(engagements[index+1] !== undefined)
						{
							if(scrollPos >= milestone.scrollTop && scrollPos < engagements[index+1].scrollTop){							
								totalScrollDist = engagements[index+1].scrollTop - milestone.scrollTop;
								relativeScrollDist = scrollPos - milestone.scrollTop;
								moveRightDist = engagements[index + 1].marginRight + 53;
								markerPos = parseInt((relativeScrollDist / totalScrollDist) * moveRightDist + summedMarginRight + milestone.marginRight);
								$('.timeMarker').css('margin-right', markerPos);
							}
						}
						else{
							if(scrollPos >= milestone.scrollTop && scrollPos < milestone.scrollTop+500){							
								totalScrollDist = milestone.scrollTop+500 - milestone.scrollTop;
								relativeScrollDist = scrollPos - milestone.scrollTop;
								moveRightDist = engagements[index + 1].marginRight + 53;
								markerPos = parseInt((relativeScrollDist / totalScrollDist) * moveRightDist + summedMarginRight);
								$('.timeMarker').css('margin-right', markerPos);
							}
						}						
						summedMarginRight += milestone.marginRight + 53;
					});					
				});
                
                // If a engagement point on the timeline is clicked the document is scrolled to the associated engagement in the document.
				$('.milestoneLink').click(function (event) {
				    var hash = this.hash.replace('#', '');
				    if (hash == 'present') {
				        $('html:not(:animated),body:not(:animated)').animate({ scrollTop: engagements[0].scrollTop }, 'slow');
				    }
				    else {
				        $.each(engagements, function (index, milestone) {
				            if (hash == milestone.label) {
				                $('html:not(:animated),body:not(:animated)').animate({ scrollTop: milestone.scrollTop }, 'slow');
				            }
				        });
				    }
				});

			}		
		});
		
})(jQuery);

// Engagement object as a function
// This object does some calculations when initiated
function Engagement(domElement){

    if (domElement == undefined)
        return;

	var self = this;
	self.element = domElement;
	self.scrollTop = $(self.element).offset().top;
	self.label = $(self.element).attr('data-timeline');
	self.startYear = parseInt($(self.element).attr('data-timeline-start-date').split(';')[0]);
	self.startMonth = parseInt($(self.element).attr('data-timeline-start-date').split(';')[1]);
	self.marginRight = 0;
	
	var now = new Date();
	self.endYear = now.getFullYear();
	self.endMonth = now.getMonth();
	var endDate = $(self.element).attr('data-timeline-end-date');
	if(endDate !== undefined){
		self.endYear = parseInt($(self.element).attr('data-timeline-end-date').split(';')[0]);
		self.endMonth = parseInt($(self.element).attr('data-timeline-end-date').split(';')[1]);
	}
	
	self.monthSpan = (self.endYear - self.startYear)*12-self.startMonth + self.endMonth; 
}