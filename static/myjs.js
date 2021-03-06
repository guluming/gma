function is_nickname(asValue) {
    var regExp = /^[가-힣]{2,6}$/
    return regExp.test(asValue);
}

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

// function post() {
//     let url = $('#url').val()
//     let comment = $("#textarea-post").val()
//     let star = $('#star').val()
//     let today = new Date().toISOString()
//     $.ajax({
//         type: "POST",
//         url: "/posting",
//         data: {
//             url_give:url,
//             comment_give: comment,
//             star_give:star,
//             date_give: today
//         },
//         success: function (response) {
//             $("#modal-post").removeClass("is-active")
//             window.location.reload()
//         }
//     })
// }

function post() {
    let url = $("#url").val()
    let title = $("#title").val()
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    let star = $('#star').val()

    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            url_give: url,
            title_give: title,
            date_give: today,
            star_give: star
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

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

function check_nick() {
    let nickname = $("#input-nickname").val()
    console.log(nickname)
    if (nickname == "") {
        $("#help-nick").text("프로필을 입력해 주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    if (!is_nickname(nickname)) {
        $("#help-nick").text("프로필의 형식을 확인해 주세요. 한글만 가능. 2-6자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    $("#help-nick").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_nick",
        data: {
            nickname_give: nickname
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-nick").text("이미 존재 하는 프로필 입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-nickname").focus()
            } else {
                $("#help-nick").text("사용할 수 있는 프로필 입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-nick").removeClass("is-loading")

        }
    });
}



// function get_posts(username) {
//     if (username == undefined) {
//         username = ""
//     }
//     $("#post-box").empty()
//     $.ajax({
//         type: "GET",
//         url: `/get_posts?username_give=${username}`,
//         data: {},
//         success: function (response) {
//             if (response["result"] == "success") {
//                 let posts = response["posts"]
//                 for (let i = 0; i < posts.length; i++) {
//                     let post = posts[i]
//                     let time_post = new Date(post["date"])
//                     let time_before = time2str(time_post)
//                     let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
//                     let count_heart = post['count_heart']
//                     let html_temp = `<div class="box" id="${post["_id"]}">
//                                         <article class="media">
//                                             <div class="media-left">
//                                                 <a class="image is-64x64" href="/user/${post['username']}">
//                                                     <img class="is-rounded" src="/static/${post['profile_pic_real']}"
//                                                          alt="Image">
//                                                 </a>
//                                             </div>
//                                             <div class="media-content">
//                                                 <div class="content">
//                                                     <p>
//                                                         <strong>${post['nickname']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
//                                                         <br>
//                                                         ${post['comment']}
//                                                     </p>
//                                                 </div>
//                                                 <nav class="level is-mobile">
//                                                     <div class="level-left">
//                                                         <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
//                                                             <span class="icon is-small">
//                                                             <i class="fa ${class_heart}"aria-hidden="true"></i>
//                                                             </span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
//                                                         </a>
//                                                     </div>
//
//                                                 </nav>
//                                             </div>
//                                         </article>
//                                     </div>`
//                     $("#post-box").append(html_temp)
//                 }
//             }
//         }
//     })
// }

function get_posts(username) {
    if (username == undefined) {
        username = ""
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

                    let star = posts[i]['star']
                    let star_image = '⭐'.repeat(star)

                    let image = posts[i]['image']
                    let title = posts[i]['title']

                    let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-content">
                                                <div class="content">
                                                <img src="${image}" class="card-img-top" id="image">
                                                    <p><strong>${post['nickname']}</strong> <small>ID:${post['username']}</small> <small>${time_before}</small>
                                                        <p class="mytitle">${title}</p>
                                                        <p>${star_image}</p>
                                                        <p class="mycomment">${post['comment']}</p>
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small">
                                                            <i class="fa ${class_heart}"aria-hidden="true"></i>
                                                            </span>
                                                            <span class="like-num">${num2str(count_heart)}</span>
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