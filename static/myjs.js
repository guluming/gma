function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

function post() {
    let comment = $("#textarea-post").val()
    let url = $("#textarea-post").val()
    let today = new Date().toISOString()

    // let url = $('#url').val()
    // let star = $('#star').val()

    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            url_give: url,
            date_give: today
            // url_give: url,
            // star_give: star
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

// $(document).ready(function(){
//           listing();
//         });
//
//         function listing() {
//             $('#cards-box').empty()
//             $.ajax({
//                 type: 'GET',
//                 url: '/lecture',
//                 data: {},
//                 success: function (response) {
//                     let rows = response['lectures']
//                     for(let i = 0; i < rows.length; i++) {
//                         let image = rows[i]['image']
//                         let title = rows[i]['title']
//                         let star = rows[i]['star']
//                         let comment = rows[i]['comment']
//
//                         let star_image = '⭐'.repeat(star)
//
//                         let temp_html = `<div class="col">
//                                             <div class="card h-100">
//
//                                                 <img src="${image}"
//                                                      class="card-img-top">
//                                                 <div class="card-body">
//                                                     <h5 class="card-title">${title}</h5>
//                                                     <p>${star_image}</p>
//                                                     <p class="mycomment">${comment}</p>
//                                                 </div>
//                                             </div>
//                                         </div>`
//
//                         $('#cards-box').append(temp_html)
//                     }
//                 }
//             })
//         }

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}

function get_posts(username) {
    if (username==undefined) {
        username=""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)
                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let count_heart = post['count_heart']

                    // let star = posts[i]['star']
                    // let star_image = '⭐'.repeat(star)

                    let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post['username']}">
                                                    <img class="is-rounded" src="/static/${post['profile_pic_real']}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>${post['profile_name']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${post['comment']}
                                                        <br>
                                                        ${post['url']}
                                                                                                                                                              
                                                        
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small">
                                                            <i class="fa ${class_heart}"aria-hidden="true"></i>
                                                            </span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
                                                        </a>
                                                    </div>

                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}
