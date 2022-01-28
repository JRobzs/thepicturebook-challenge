<?php

function generate_ad_slot($dsp, $size, $id){
    $slot = '<div class="dd-slots">
            <span class="ad-label">Advertisement</span>
            <div class="slot-data" data-dsp="DSP" data-d-size="SIZE" id="ID" align="center">
            </div>
            </div>';
    $slot = str_replace("DSP", $dsp, $slot);
    $slot = str_replace("SIZE", $size, $slot);
    $slot = str_replace("ID", $id, $slot);
    $centered_id = 'top-banner';
    if($id != $centered_id){
        $slot = str_replace('align="center"', "", $slot);
    }
    return $slot;
}

function top_ad_slot(){
  echo(generate_ad_slot('/22360860229/Aditude/aditude_test1', "[[970, 250]]", "top-banner"));
}

function right_rail_top_slot(){
  echo(generate_ad_slot('/22360860229/Aditude/aditude_test2', "[[300, 250]]", "right-rail-top"));
}

function insert_ads(){
    add_filter( 'colormag_before_main', 'top_ad_slot' );
    add_filter( 'colormag_before_sidebar', 'right_rail_top_slot' );
    add_filter('the_content', 'create_in_content_ads');
}

insert_ads();



//Places unique markers for seperating sections
//Returns content with markers
function place_markers($content){
    //Adds markers to beginning and end of content
    $sealed_content = 'bbb'.$content.'aaa';
    //Places front|end markers before h2 tags
    $replaced_content = str_replace('<h2','aaabbb<h2',$sealed_content);
    return $replaced_content;
}
//Seperates each section using the makeshift markers
//Returns array of individual sections
function isolate_sections($content){
    $replaced_content = place_markers($content);
    $regex = '#bbb(.*?)aaa#s';
    //Creates array of content sections
    $section_isolater = preg_match_all($regex, $replaced_content, $sections);
    //Captures only grouped regex
    $sections = $sections[1];
    return $sections;
}
//Create a boolean array of whether the first section is greater than 125 characters
//Returns T/F array
function create_true_false_array($content){
    $sections = isolate_sections($content);
    //Loops through each sections cheking if str length of first <p> is >= to 125
    $tf_array = array();
    foreach ($sections as $key => $value){
        $section = $sections[$key];
        //Regex to match first <p> for section
        $paras = preg_match('#<p[!>]*>(.*)</p>#', $section, $p_tags);
        //Captures only grouped regex
        $p_tags = $p_tags[1];
        //Gets length of text in <p>
        $p_len = strlen($p_tags);
        //Checks in len p >=125 and adds boolean to tf_array
        if($p_len > 125){
            $tf_array[$key] = 0;
        } else{
            $tf_array[$key] = 1;
        }
    }
    return($tf_array);
}

//Adds temporary slots for where each Ad unit will be placed
//Returns sections with temp slots
function add_temp_prebid_slot($content){
    $tf_array = create_true_false_array($content);
    $sections = isolate_sections($content);
    //Loops through each section
    foreach ($sections as $key => $value){
        //Checks if ad should be after 1st or 2nd <p>
        //Adds temp ad slot accordingly
        if ($tf_array[$key]){
            $sections[$key] = preg_replace('#(<\/p>)#', '\1'.'Prebid_ad', $sections[$key], 2);
            $sections[$key] = preg_replace('#(Prebid_ad)#', '', $sections[$key], 1);
        } else {
            $sections[$key] = preg_replace('#(<\/p>)#', '\1'.'Prebid_ad', $sections[$key], 1);
        }
    }
    return $sections;
}

//Joins together updated sections with temp slot
//Returns joined content
function join_sections($content){
    $sections_with_temp = add_temp_prebid_slot($content);
    //Joins sections
    $joined_content = join($sections_with_temp);
    return $joined_content;
}

//Uses str replace to add temp slots after all H2s
//Returns whole content with all temp ad slots
function add_slot_after_h2s($content){
    $joined_content = join_sections($content);
    //Places ad slot after each </h2>
    $slot_complete_content = str_replace('</h2>', '</h2>Prebid_ad', $joined_content);
    return $slot_complete_content;
}

//Counts how many ad units are to be added
//Returns number of ad units needed
function count_temp_ads($content){
    $slot_complete_content = add_slot_after_h2s($content);
    //Counts number of temp slots
    $ad_count = preg_match_all('#Prebid_ad#', $slot_complete_content);
    return $ad_count;
}

//Replaces temp ad slots with ad units with numbered ids
//Return final content with ads
function replace_temp_slots($content){
    $slot_complete_content = add_slot_after_h2s($content);
    $ad_count = count_temp_ads($content);
    //Loops through number of ad units needed
    for ($i = 1; $i <= $ad_count; $i++){
        $ad_unit = '<section class="ad_slot" data-dsp="/22360860229/Aditude/aditude_test1" data-msp="/22360860229/Aditude/aditude_test2"></section>';
        //Sets ad unit id to ordered number
        $numbered_ad_unit = preg_replace('#ad_unit_id#', 'content-ad-'.$i, $ad_unit);
        //replaces temp slot for each numbered ad unit
        $slot_complete_content = preg_replace('#Prebid_ad#', $numbered_ad_unit ,$slot_complete_content, 1);
    }
    return $slot_complete_content;
}
//Checks if is_single
//Returns content with ad units
function create_in_content_ads($content){
  if (is_single()) {
    $content = replace_temp_slots($content);
  }
  return $content;
}
