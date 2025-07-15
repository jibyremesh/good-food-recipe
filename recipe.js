window.onload = fetchRecipeData;
/**************fetch recipe data using AJAX******************/
function fetchRecipeData() {
    if (window.XMLHttpRequest) {
        xhrRequest = new XMLHttpRequest();
    }
    else {
        if (window.ActiveXObject) {
            xhrRequest = newActiveXObject("Microsoft.XMLHTTP");
        }
    }
    if (xhrRequest) {
        xhrRequest.open("GET", "recipe.json", true);
        xhrRequest.setRequestHeader("Content-Type", "application/JSON");
        xhrRequest.send();
        xhrRequest.onreadystatechange = populateRecipeDataTable;
    }
    else {
        showErrorMessage("Could not process recipe load request");
    }
    setTimeout(fetchRecipeData, 500);
}

/**************Shows Error Message******************/
function showErrorMessage(msg) {
    let errorContainer = document.querySelector('.error');
    if (errorContainer) {
        errorContainer.innerHTML = msg;
        errorContainer.classList.contains('dn') ? errorContainer.classList.replace('dn', 'db') : ''
    }
}

/**************Generate recipe table******************/
function populateRecipeDataTable() {
    if (xhrRequest.readyState == 4) {
        if (xhrRequest.status == 200) {
            document.querySelector('.error').classList.replace('db', 'dn');
            let tableElem = document.querySelector('#recipe');
            let recipeData = JSON.parse(xhrRequest.responseText);
            tableElem.innerHTML = '';
            for (let index = 0; index < recipeData.recipes.length; index++) {
                populateRecipeTabRows(tableElem, recipeData.recipes[index])
            }
        }
        else {
            showErrorMessage("Error occured while loading data: " + xhrRequest.status);
        }
    }
}

/**************Generate recipe table rows******************/
function populateRecipeTabRows(tableElem, recipeData) {
    var tbodyElem, row;
    var title = recipeData.title ? recipeData.title : '',
        icon = recipeData.imageUrl ? recipeData.imageUrl : ''
    author = recipeData.author ? recipeData.author : ''
    starCount = recipeData.ratingStar ? recipeData.ratingStar : 0,
        ratingValue = recipeData.ratingCount ? recipeData.ratingCount : 0,
        commentCount = recipeData.commentCount ? recipeData.commentCount : 0,
        prepTime = recipeData.prepTime ? recipeData.prepTime : '',
        cookTime = recipeData.cookTime ? recipeData.cookTime : '',
        skillLevel = recipeData.effortLevel ? recipeData.effortLevel : '',
        servingSize = recipeData.servingSize ? recipeData.servingSize : 0,
        description = recipeData.description ? recipeData.description : '',
        nutritionInfo = recipeData.nutritionInfo ? recipeData.nutritionInfo : [],
        ingredients = recipeData.ingredients ? recipeData.ingredients : [],
        cookingSteps = recipeData.cookingSteps ? recipeData.cookingSteps : []
    tbodyElem = tableElem.createTBody();
    row = tbodyElem.insertRow();
    row.innerHTML = generateRecipeHeaderRow(icon, title, author, starCount, ratingValue, commentCount);
    row = tbodyElem.insertRow();
    row.innerHTML = generateRecipeSummaryRow(prepTime, cookTime, skillLevel, servingSize, description);
    row = tbodyElem.insertRow();
    row.innerHTML = generateRecipeContentHead();
    row = tbodyElem.insertRow();
    row.innerHTML = generateRecipeContentRow(nutritionInfo, ingredients, cookingSteps)
}

/**************Generate Recipe Headers******************/
function generateRecipeHeaderRow(icon, title, author, starCount, ratingValue, commentCount) {
    return `<td colspan="2" class="title-col"><div class="flex-center"><div><img src="${icon}"></div>
    <div class="title">${title}</div></div></td>
    <td class="recipe-info"><div class="flex-center"><div class="author">By ${author}</div>
    <div class="review-info"><span>${generateRatingElement(starCount)}</span>
    <span class='pl-10'>${ratingValue} ratings</span>
    <div class='link'>${commentCount} comments</div></div>
    </div></div>
    </td>`;
}

/**************Generate Rows with time,skill,servings ******************/
function generateRecipeSummaryRow(prepTime, cookTime, skillLevel, servingSize) {
    let timeIcon = 'assets/time.png', cookEffortIcon = 'assets/skill.png',
        serveIcon = 'assets/serve.png';
    return `<td colspan="2" class="summary-col"><div class="flex-center">
    <div class='pl-10 time-info'><img src="${timeIcon}">
    <span class='recipe-time pl-10'><div><span class='time-label'>Prep: ${prepTime}</span></div>
    <div class='cook-time'><span class='time-label'>Cook: ${cookTime}</span></div></span></div>
    <div class="flex-center"><img src="${cookEffortIcon}"><span class='pl-10'>${skillLevel}</span></div>
    <div class="flex-center"><img src="${serveIcon}"><span class='pl-10'>Serves ${servingSize}</span></div>
    </div>
    </td>
    <td class='desc'>${description}</td>`;
}

/**************Generate Recipe Nutrition & Ingredients Head ******************/
function generateRecipeContentHead() {
    return `<td class='tb-10 nutri-title'>Nutrition: Per serving</td>
    <td class='ingred-title'>Ingredients</td><td class='method-title'>Cooking Method</td>`
}
/**************Generate Recipe Nutrition & Ingredients & Cooking Steps Content Row ******************/
function generateRecipeContentRow(nutritionInfo, ingredients, cookingSteps) {
    return `<td class='br-o va-t' width="15%">${generateNutritionList(nutritionInfo)}</td>
    <td class='br-o va-t' width="25%">${generateIngredientsList(ingredients)}</td>
    <td width="60%">${generateCookSteps(cookingSteps)}</td>`
}
/**************Generate Nutrition List******************/
function generateNutritionList(nutritionInfo) {
    let nutriElem = '', index;
    for (index = 0; index < nutritionInfo.length; index++) {
        nutriElem += `<li class="nutri-list-item"><span class='nutri-label'>${nutritionInfo[index].item}</span>
        <span>${nutritionInfo[index].value + nutritionInfo[index].unit}</span></li>`;
    }
    return `<ul>${nutriElem}</ul>`;
}
/**************Generate Ingredients List******************/
function generateIngredientsList(ingredientsInfo) {
    let ingredElem = '', index;
    for (index = 0; index < ingredientsInfo.length; index++) {
        ingredElem += `<li class="ingred-list-item">
        <span class='ingred-label'>${ingredientsInfo[index]}</span>
        </li>`;
    }
    return `<ul>${ingredElem}</ul>`;
}
/**************Generate Cooking Steps List******************/
function generateCookSteps(cookSteps) {
    let cookElem = '', index;
    for (index = 0; index < cookSteps.length; index++) {
        cookElem += `<li class="cook-list-item"><div class='cook-label'>${cookSteps[index].title}</div>
        <span>${cookSteps[index].text}</span></li>`;
    }
    return `<ul>${cookElem}</ul>`;
}
/**************Generate Rating Star Strip******************/
function generateRatingElement(rating) {
    let rateElem = '', index;
    for (index = 0; index < 5; index++) {
        rateElem += index < rating ? ' <span class="fa fa-star rated"></span>' : ' <span class="fa fa-star"></span>'
    }
    return rateElem;
}

