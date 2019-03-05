const Handlebars   = require('handlebars');
const _            = require('lodash');
const Querystring  = require('querystring');

module.exports = (page, pages, path, query) => {
  if (!page || !pages) return;
  if (page <= 0) return;
  if (page > pages) return;

  let content = `<div class="paginations">
    <ul>${paginate(page, pages, path, query)}</ul></div>`;
  return new Handlebars.SafeString(content);
};

function paginate(page, pages, path, query) {
  query = Querystring.stringify(query);
  let content = [];
  const pageList = numbersAround(page, 1, pages);
  if (_.isEmpty(pageList)) return;

  if (page != 1) {
    content.push(`<li><a href="${queryParams(path, page - 1, query)}">
                  <span class="glyphicon glyphicon&#45;chevron&#45;left"/>
                  </a></li>`);
    content.push(`<li><a href="${queryParams(path, 1, query)}">1</a></li>`);
  }

  if ((_.first(pageList) - 1) > 1) {
    content.push('<li><span>...</span></li>');
  }
  var pageListContent = pageList.map((pageNo) => {
    return `<li${selectedCss(pageNo, page)}>
      <a href="${queryParams(path, pageNo, query)}">${pageNo}</a></li>`;
  }).join('');
  content.push(pageListContent);
  if ((_.last(pageList) + 1) < pages) {
    content.push('<li><span>...</span></li>');
  }

  if (page != pages) {
    content.push(`<li><a href="${queryParams(path, pages, query)}">${pages}</a></li>`);
    content.push(`<li><a href="${queryParams(path, page + 1, query)}">
                  <span class="glyphicon glyphicon&#45;chevron&#45;right"/>
                  </a></li>`);
  }
  return content.join('');
};

function queryParams(path, pageNum, queryParams) {
  return `${path}?page=${pageNum}&${queryParams}`;
}

function selectedCss(page, targetPage) {
  return (page == targetPage)? ' class="selected"' : '';
}

function numbersAround(number, leftLimit, rightLimit, limit = 4) {
  let nums = [number];
  let leftNum = number;
  let addToLeft = true;
  let rightNum = number;
  let addToRight = true;

  while ( limit > 0 && ( addToLeft || addToRight )) {
    leftNum--;
    addToLeft = leftNum > leftLimit;
    if (addToLeft) {
      nums.splice(0, 0, leftNum);
      limit--;
    }
    if (limit <= 0) return nums;

    rightNum++;
    addToRight = rightNum < rightLimit;
    if (addToRight) {
      nums.splice(nums.length, 0, rightNum);
      limit--;
    }
  }

  return nums;
};
